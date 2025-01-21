import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "@/states/slices/userSlice";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const LoginPage = () => {
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function handleSubmit(values: z.infer<typeof userSchema>) {
    const { email, password } = values;
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigate("/home");
          dispatch(
            addUser({
              displayName: user.displayName,
              email: user.email,
              userId: user.uid,
            })
          );
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoginError("Invalid Credentials!");
        });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-[300px] border border-[#d1d1d1] rounded-md p-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{loginError}</FormMessage>
          <Button type="submit" className="w-full my-1">
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/signup");
            }}
            variant="outline"
            className="w-full"
          >
            SignUp
          </Button>
        </form>
      </FormProvider>
      <h1 className="text-[0.8rem] absolute bottom-7 left-1/2 -translate-x-1/2 tracking-widest">
        EXPENSE TRACKER
      </h1>
    </div>
  );
};

export default LoginPage;
