from sqlalchemy import Column, String, Text, DateTime, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from .config import settings

async_engine = create_async_engine(settings.async_database_url, echo=False)
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)
Base = declarative_base()

class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"
    
    id = Column(String, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

DEFAULT_KNOWLEDGE_BASES = {
    "admin": """# 宠物店日常经营与连锁管理规范

## 1. 核心财务与盈亏平衡
- 黄金盈亏比：洗护美容服务营收应占 60%，宠粮商品搭售占 30%，特色SPA及寄养占 10%。
- 会员卡充值管理：充值返赠最高不超过 15%，确保现金流健康。黄金卡储值 ￥1000（送100），钻石卡储值 ￥3000（送500）。
- 佣金分配规则：技师基础提成 10%，完成高阶SPA或皮肤治疗服务提成 15%，搭售低库存商品提成 5%。

## 2. 员工考勤与班次排定
- 早班 (09:00-18:00)：负责开店、设备消毒、检查宠物状态及发放早粮。
- 晚班 (12:00-21:00)：负责晚间清仓、垃圾清运、结算收银、更新宠物状态及确保店面安全。
- 考勤异常：迟到 15 分钟内不扣，超出半小时按事假半天计，连续 3 次迟到扣除绩效提成。

## 3. 库存预警与自动订货规则
- 安全库存下限：主粮/冻干类不得低于 10 包。洗剂用品不得低于 5 瓶。
- 进货周期：每周一上午 10:00 统一向签约供应链下达补货清单。""",
    "staff": """# 宠物洗护美容技术规程与安全手册

## 1. 贵宾/比熊犬日系修修剪造型要点
- 日系棉花糖圆头：耳根向上轻提，与头顶毛发无缝修剪成圆形，避免修剪过短导致皮肤暴露。
- 腿段修剪：腿部毛发用排梳向外拉松，剪刀垂直地修出圆柱状，保持行走时的轻盈蓬松感。

## 2. 局部皮肤炎症浴疗配方
- 燕麦低敏洗剂：适合过度干燥、有轻度微量抓痕的犬猫。水温严格控制在 36℃-38℃（恒温），浸泡 5 分钟，顺毛轻按。
- 死海盐SPA海泥：适用于湿疹、真菌性耳垢异味的重度护养，浴后须用毛巾包覆保温。

## 3. 情绪梳理与咬伤预防要点
- 猫咪敏感应激：使用"三轻"原则（动作轻、声音轻、水流轻）。使用猫袋辅助，禁止大功率吹风机直吹头部。
- 咬伤防范：操作凶猛犬或高应激宠物时，必须戴防咬手套，嘴套尺寸需合规，操作前喂食高能冻干。""",
    "customer": """# 宠物健康自助答疑与门店服务 FAQ

## 1. 常见耳朵瘙痒与黑褐色分泌物（耳螨相关）
- 症状判定：宠物频繁甩头、用后脑勺擦地。耳道内有黑褐色咖啡渣样分泌物。
- 护理建议：严禁用干棉签深掏。使用宠物专用洗耳液（如维克、耳肤灵），每次滴入 5-8 滴，揉捏耳根 15 秒后任其甩出，再擦净外耳壁。

## 2. 会员预约与充值扣款 FAQ
- 预约取消：请至少提前 4 小时在小程序中取消。迟到超过 30 分钟预约自动顺延或作废。
- 会员卡余额：每消费 10 元积 1 分。钻石卡会员独享全场洗护美容 8.5 折优惠，黄金卡会员享受 9.0 折。

## 3. 饮食黑名单
- 绝对禁食：巧克力、洋葱、大蒜、葡萄、木糖醇、坚果及禽类细碎管状骨头。""",
}

async def seed_default_data():
    async with AsyncSessionLocal() as session:
        try:
            for kb_type, content in DEFAULT_KNOWLEDGE_BASES.items():
                result = await session.execute(
                    select(KnowledgeBase).where(KnowledgeBase.id == kb_type)
                )
                existing = result.scalar_one_or_none()
                if not existing:
                    kb = KnowledgeBase(id=kb_type, content=content)
                    session.add(kb)
            await session.commit()
        finally:
            await session.close()

async def get_all_kb() -> dict[str, str]:
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(select(KnowledgeBase))
            kbs = result.scalars().all()
            return {kb.id: kb.content for kb in kbs}
        finally:
            await session.close()

async def get_kb(kb_type: str) -> str | None:
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(KnowledgeBase).where(KnowledgeBase.id == kb_type)
            )
            kb = result.scalar_one_or_none()
            return kb.content if kb else None
        finally:
            await session.close()

async def update_kb(kb_type: str, content: str) -> bool:
    if kb_type not in VALID_KB_TYPES:
        return False
    
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(KnowledgeBase).where(KnowledgeBase.id == kb_type)
            )
            kb = result.scalar_one_or_none()
            if kb:
                kb.content = content
                kb.updated_at = datetime.utcnow()
            else:
                kb = KnowledgeBase(id=kb_type, content=content)
                session.add(kb)
            await session.commit()
            return True
        except Exception as e:
            await session.rollback()
            return False
        finally:
            await session.close()

VALID_KB_TYPES = {"admin", "staff", "customer"}