import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký từ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
});

type signInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { signIn } = useAuthStore();
  const navigation = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInFormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: signInFormValues) => {
    const { username, password } = data;

    try {
      await signIn(username, password);
      navigation("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <a href="/" className="mx-auto block w-fit text-center">
                <img src="/logo.svg" alt="logo" />
              </a>
              <h1 className="text-2xl font-bold">Đăng nhập</h1>
              <p className="text-muted-foreground text-balance">
                Chào mừng bạn đã quay lại
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="username" className="block-text-sm">
                Tên đăng nhập
              </Label>
              <Input type="text" id="username" {...register("username")} />
              {errors.username && (
                <p className="text-destructive text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="password" className="block-text-sm">
                Mật khẩu
              </Label>
              <Input type="password" id="password" {...register("password")} />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              Đăng nhập
            </Button>
            <div className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <a href="/signup" className="underline-offset-4">
                Đăng ký
              </a>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover "
            />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-balance text-center *:[a]:hover:text-primary">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dich vụ</a> và{" "}
        <a href="#">chính sách</a>.
      </div>
    </div>
  );
}
