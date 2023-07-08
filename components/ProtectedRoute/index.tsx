import { useRouter } from "next/router";
import { useEffect } from "react";

import useFirebaseAuth from "hooks/FirebaseAuth";
import { useSelector } from "store";
import { getProfile } from "store/api/profile";

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: any;
  allowedRoles: Array<string>;
}) => {
  const user = useSelector(getProfile);
  const { authUser, loading } = useFirebaseAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!authUser || !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [authUser, user, loading]);

  return children;
};
