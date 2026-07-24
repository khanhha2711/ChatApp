import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriend";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  email: string;
  isFound: boolean | null;
  searchUserByEmail: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}
const SearchForm = ({
  register,
  errors,
  email,
  loading,
  isFound,
  searchUserByEmail,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Tìm bằng email</Label>
        <Input
          id="email"
          placeholder="Nhập email..."
          {...register("email", {
            required: "Email không được bỏ trống",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email không hợp lệ" },
          })}
        ></Input>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        {isFound === false && (
          <span className="text-destructive">
            Không tìm thấy <span>{searchUserByEmail}</span>
          </span>
        )}
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            }
            className="flex-1"
          ></DialogClose>
          <Button
            type="submit"
            disabled={loading || !email?.trim()}
            className="flex-1 "
          >
            {loading ? (
              <span>Đang tìm ...</span>
            ) : (
              <>
                <Search />
                <p>Tìm</p>
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export default SearchForm;
