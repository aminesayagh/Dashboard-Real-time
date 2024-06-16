import { authOptions } from "@/utils/authoptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export default handler;
// export { handler as GET, handler as POST };
