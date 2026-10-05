import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter your password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      <div className="password-wrapper">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;