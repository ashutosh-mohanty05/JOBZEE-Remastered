import React, { useEffect, useRef } from "react";
import { loadGoogleScript } from "../../utils/loadGoogleScript";
import api from "../../utils/api";
import toast from "react-hot-toast";

// Renders Google's official "Continue with Google" button and wires it up
// to POST /api/v1/user/google-auth. `role` only matters the first time a
// brand-new Google account signs up (existing accounts log in regardless).
const GoogleButton = ({ role, disabled, onAuthSuccess, onNeedsRole }) => {
  const buttonRef = useRef(null);
  const roleRef = useRef(role);
  roleRef.current = role;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;

    loadGoogleScript()
      .then((google) => {
        if (cancelled || !buttonRef.current) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const { data } = await api.post("/user/google-auth", {
                credential: response.credential,
                role: roleRef.current || undefined,
              });

              if (data.needsRole) {
                toast.error("Please select a role above, then tap the Google button again.");
                onNeedsRole?.();
                return;
              }

              toast.success(data.message);
              onAuthSuccess?.(data);
            } catch (error) {
              toast.error(error.response?.data?.message || "Google sign-in failed.");
            }
          },
        });

        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320,
        });
      })
      .catch(() => toast.error("Could not load Google sign-in."));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="google-btn-placeholder">
        Google Sign-In isn't configured yet — add{" "}
        <code>VITE_GOOGLE_CLIENT_ID</code> to <code>frontend/.env</code>.
      </div>
    );
  }

  return (
    <div className={`google-btn-wrap${disabled ? " is-disabled" : ""}`}>
      <div ref={buttonRef} />
      {disabled && (
        <div className="google-btn-overlay" title="Select a role above first">
          Select a role above first
        </div>
      )}
    </div>
  );
};

export default GoogleButton;
