import { createClient } from "@supabase/supabase-js";

const createUser = async () => {
  const email = "caoqixin7@gmail.com";
  const password = "Caoqixin7";
  const name = "xin";
  const PROJECT_URL = "https://rbihkyhxpsizdphgybgk.supabase.co";
  const ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWhreWh4cHNpemRwaGd5YmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MjM0MzQsImV4cCI6MjAyNjA5OTQzNH0.EvCEfeiCcI2R2Q50ClMiOe7VEYRu7Yl1KNUwORVK8Q0";
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
