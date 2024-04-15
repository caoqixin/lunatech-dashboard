import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const createUser = async () => {
  dotenv.config({ path: ".env.local" });

  const email = process.env.NEXT_PUBLIC_EMAIL!;
  const password = process.env.NEXT_PUBLIC_PASSWORD!;
  const name = process.env.NEXT_PUBLIC_NAME;
  const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(PROJECT_URL, ANON_KEY);

  try {
    const user = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          image: "",
        },
      },
    });

    return {
      msg: `${user.data.user?.email} 添加成功`,
      data: user.data.user,
    };
  } catch (error) {
    return {
      msg: "添加失败",
      error: error,
    };
  }
};

createUser()
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
