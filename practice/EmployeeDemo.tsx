import { useState } from "react";

function EmployeeDemo() {
  const [name, setName] = useState<string>("Tle");
  const [salary, setsalary] = useState<number>(30000);
  const [isVisible, setIsvisible] = useState<boolean>(true);
  return (
    <>
      <div className="">
        <h2>ชื่อ พนักงาน : {name}</h2>
        <h2>เงินเดือน {salary}</h2>
      </div>
      <hr />

      <input value={name} onChange={(e)=> setName(e.target.value)}/>
      <button onClick={()=>setsalary(salary+1000)}>เพิ่ม</button>
      <button onClick={()=>setsalary(salary-1000)}>ลด</button>
      
      <div className="text-head">ชื่อ พนักงาน : {name}</div>
    </>
  );
}

export default EmployeeDemo;
