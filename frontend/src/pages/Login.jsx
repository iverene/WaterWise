import { useState } from "react";
import { FiClipboard, FiDroplet, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router";
import { MOCK_ROLE_STORAGE_KEY } from "../config/mockAuth";
import { login } from "../services/auth.service";

const roles = [
  {
    id: "admin",
    label: "Admin",
    eyebrow: "Barangay Officials",
    Icon: FiShield,
    route: "/admin/dashboard",
  },
  {
    id: "meter-reader",
    label: "Meter Reader",
    eyebrow: "Field Personnel",
    Icon: FiClipboard,
    route: "/meter-reader/readings-entry",
  },
  {
    id: "consumer",
    label: "Consumer",
    eyebrow: "Community Portal",
    Icon: FiDroplet,
    route: "/consumer/usage-metrics",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password.trim()) {
      setMessage("Enter your credentials to continue.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await login({ email: trimmedIdentifier, password });
      const authenticatedRole = result.user?.role === "tenant"
        ? "consumer"
        : result.user?.role;
      const destination = roles.find(({ id }) => id === authenticatedRole);

      if (!destination) {
        throw new Error("Your account role does not have a configured portal.");
      }

      window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, destination.id);
      setMessage(`Signed in as ${destination.label}.`);
      navigate(destination.route);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 font-[Inter,system-ui,sans-serif] text-[#0F172A] sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="flex min-h-[360px] flex-col justify-between bg-[#0F172A] p-8 text-white sm:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-200">
                WaterWise
              </p>
              <h1 className="mt-5 max-w-md text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                Sucol Water System access portal
              </h1>
            </div>

            <div className="grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3 lg:grid-cols-1">
              {roles.map((role) => (
                <div className="flex items-start gap-3" key={role.id}>
                  <role.Icon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 text-sky-200"
                  />
                  <div>
                  <p className="text-sm font-semibold text-white">
                    {role.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{role.eyebrow}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-xl">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
                  Secure sign in
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#0F172A]">
                  Sign in to your account
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Your account permissions determine which portal opens after sign in.
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="text-sm font-semibold text-[#0F172A]"
                    htmlFor="login-identifier"
                  >
                    Email or username
                  </label>
                  <input
                    autoComplete="username"
                    className="mt-2 w-full rounded-[6px] border border-slate-300 bg-white px-4 py-3 text-base text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                    id="login-identifier"
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="name@sucolwater.gov"
                    type="text"
                    value={identifier}
                  />
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-[#0F172A]"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      autoComplete="current-password"
                      className="w-full rounded-[6px] border border-slate-300 bg-white py-3 pl-4 pr-12 text-base text-[#0F172A] outline-none transition placeholder:text-slate-400 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20"
                      id="login-password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-[6px] text-slate-500 transition hover:text-[#0284C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0284C7]"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      {showPassword ? (
                        <FiEyeOff aria-hidden="true" className="h-5 w-5" />
                      ) : (
                        <FiEye aria-hidden="true" className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  className="w-full rounded-[6px] bg-[#0284C7] px-5 py-3 text-base font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </button>

                {message && (
                  <p
                    className="rounded-[6px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#0F172A]"
                    role="status"
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
