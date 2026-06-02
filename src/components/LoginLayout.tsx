import React, { useState } from "react";
import { UserRole } from "../types";
import { Shield, Key, Sparkles, AlertCircle } from "lucide-react";

interface LoginLayoutProps {
  onLoginSuccess: (role: UserRole, username: string, name: string) => void;
}

export default function LoginLayout({ onLoginSuccess }: LoginLayoutProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("请输入账号和密码");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Role checking logic matching user descriptions
      if (username === "admin" && password === "123456") {
        onLoginSuccess(UserRole.SUPER_ADMIN, "admin", "张老板");
      } else if (username === "manager" && password === "123456") {
        onLoginSuccess(UserRole.MANAGER, "manager", "陈店长");
      } else if (username === "staff" && password === "123456") {
        onLoginSuccess(UserRole.STAFF, "staff", "高级美容师丽丽");
      } else if (username === "member" && password === "123456") {
        onLoginSuccess(UserRole.CUSTOMER, "member", "陈女士 (黄金卡会员)");
      } else {
        setError("账号或密码错误。提示：请使用下方的快捷登录通道，或输入 admin/123456");
      }
    }, 600);
  };

  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switch (role) {
        case UserRole.SUPER_ADMIN:
          onLoginSuccess(UserRole.SUPER_ADMIN, "admin", "张老板");
          break;
        case UserRole.MANAGER:
          onLoginSuccess(UserRole.MANAGER, "manager", "陈店长");
          break;
        case UserRole.STAFF:
          onLoginSuccess(UserRole.STAFF, "staff", "高级美容师丽丽");
          break;
        case UserRole.CUSTOMER:
          onLoginSuccess(UserRole.CUSTOMER, "member", "陈女士 (黄金卡会员)");
          break;
      }
    }, 300);
  };

  return (
    <div id="login_container" className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[130px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            宠物智管云端原型系统
          </h1>
        </div>
        <p className="mt-2 text-center text-sm text-slate-400">
          智能化多角色联动运营原型演示 (PC端后台 + 移动端小程序)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                账号 (User Key)
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Shield size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="请输入您的账号... (或点击下方快捷通道)"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                密码 (Credential)
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="密码默认为 123456"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={14} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "验证并登录云系统"
                )}
              </button>
            </div>
          </form>

          {/* Quick Login Passcards */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-4">
              ✨ 快速体验账号通道 (免密码点击)
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              {/* Card 1: Boss/Owner */}
              <button
                onClick={() => handleQuickLogin(UserRole.SUPER_ADMIN)}
                className="p-3 bg-slate-900/50 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-700/60 rounded-xl text-left transition-all group scale-100 active:scale-95"
              >
                <div className="flex justify-between items-center text-[10px] text-blue-400 font-semibold mb-1">
                  <span>超级管理员</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:animate-ping" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">老板/店主后台</div>
                <div className="text-[10px] text-slate-500 font-mono">所有功能 / AI分析</div>
              </button>

              {/* Card 2: Manager */}
              <button
                onClick={() => handleQuickLogin(UserRole.MANAGER)}
                className="p-3 bg-slate-900/50 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-700/60 rounded-xl text-left transition-all group scale-100 active:scale-95"
              >
                <div className="flex justify-between items-center text-[10px] text-emerald-400 font-semibold mb-1">
                  <span>店长/管理员</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">业务管理端</div>
                <div className="text-[10px] text-slate-500 font-mono">除设置与员工外全开</div>
              </button>

              {/* Card 3: Staff */}
              <button
                onClick={() => handleQuickLogin(UserRole.STAFF)}
                className="p-3 bg-slate-900/50 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-700/60 rounded-xl text-left transition-all group scale-100 active:scale-95"
              >
                <div className="flex justify-between items-center text-[10px] text-indigo-400 font-semibold mb-1">
                  <span>普通店员</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">洗护/美容助理</div>
                <div className="text-[10px] text-slate-500 font-mono">我的工单 / AI洗护建议</div>
              </button>

              {/* Card 4: Customer */}
              <button
                onClick={() => handleQuickLogin(UserRole.CUSTOMER)}
                className="p-3 bg-slate-900/50 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-700/60 rounded-xl text-left transition-all group scale-100 active:scale-95"
              >
                <div className="flex justify-between items-center text-[10px] text-pink-400 font-semibold mb-1">
                  <span>会员小程序</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">客户端演示</div>
                <div className="text-[10px] text-slate-500 font-mono">温馨橙粉色 / AI健康咨询</div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            * 提示：标准输入账号 “admin” “manager” “staff” “member”，密码 “123456” 亦可正常校验
          </p>
        </div>
      </div>
    </div>
  );
}
