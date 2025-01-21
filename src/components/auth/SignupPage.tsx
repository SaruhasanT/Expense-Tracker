import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useDispatch } from "react-redux";
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
const userSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Password didn't match!",
      path: ["confirm_password"],
    }
  );
const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  function handleSubmit(values: z.infer<typeof userSchema>) {
    const { email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        dispatch(
          addUser({
            displayName: user.displayName,
            email: user.email,
            userId: user.uid,
          })
        );
        navigate("/home");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
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
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage />
          <Button type="submit" className="w-full my-1">
            Submit
          </Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/login");
            }}
            variant="outline"
            className="w-full"
          >
            Login
          </Button>
        </form>
      </FormProvider>
      <h1 className="text-[0.8rem] absolute bottom-7 left-1/2 -translate-x-1/2 tracking-widest">
        EXPENSE TRACKER
      </h1>
    </div>
  );
};

export default SignupPage;
