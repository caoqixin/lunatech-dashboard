import { Phone } from "@/lib/definitions";
import { DeletePhone } from "./delete-phone";
import { EditPhone } from "./edit-phone";

const PhoneCellAction = (phone: Phone) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <EditPhone {...phone} />
      <DeletePhone {...phone} />
    </div>
  );
};

export default PhoneCellAction;
