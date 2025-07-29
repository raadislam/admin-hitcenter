import AddEmployeeModal from "@/components/dashboard/employees/AddEmployeeModal";
import Image from "next/image";

export default function EmployeeCreate() {
  return (
    <>
      <section className="relative w-full py-8 px-4 flex items-center justify-between max-w-5xl mx-auto min-h-[112px]">
        <div className=" flex-1">
          <h1 className="text-[28px] leading-8 font-semibold text-[#2b2c2c] mb-1">
            Start Expanding Your{" "}
            <span className="text-[var(--color-primary)] font-semibold">
              Team
            </span>
            <br />
            Every Great Company Begins Here.
          </h1>
          <p className="text-[15px] text-[#777A7A] font-medium leading-[22px] mt-2 w-2xl">
            Know your team better! Recruit, organize, and empower staff with our
            smart Employee Management system.
          </p>
        </div>
        <div className="-z-0 absolute right-1 top-1.5  ml-6">
          <Image
            src="/generic/form/employee.png"
            alt="employee"
            width={170}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </section>
      <div className="relative z-20 w-full">
        <AddEmployeeModal />
      </div>
    </>
  );
}
