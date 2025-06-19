import React, { useEffect } from "react";
import { Table, Input } from "antd";
import type { TableProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import { fetchUsers, setFilter } from "../store/userSlice";
import type { AppDispatch } from "../store/store";

interface DataType {
  key: string;
  name: string;
  username: string;
  email: string;
  phone: string;
}

const UserTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, filters } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const data: DataType[] = users.map((user) => ({
    key: String(user.id),
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
  }));

  const filteredData = data.filter((item) =>
    Object.entries(filters).every(([key, value]) =>
      item[key as keyof DataType].toLowerCase().startsWith(value.toLowerCase())
    )
  );

  const onFilterChange = (field: string, value: string) => {
    dispatch(setFilter({ field, value }));
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: (
        <>
          Name <br />
          <Input
            placeholder="Search Name"
            value={filters.name}
            onChange={(e) => onFilterChange("name", e.target.value)}
          />
        </>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <>
          Username <br />
          <Input
            placeholder="Search Username"
            value={filters.username}
            onChange={(e) => onFilterChange("username", e.target.value)}
          />
        </>
      ),
      dataIndex: "username",
      key: "username",
    },
    {
      title: (
        <>
          Email <br />
          <Input
            placeholder="Search Email"
            value={filters.email}
            onChange={(e) => onFilterChange("email", e.target.value)}
          />
        </>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <>
          Phone <br />
          <Input
            placeholder="Search Phone"
            value={filters.phone}
            onChange={(e) => onFilterChange("phone", e.target.value)}
          />
        </>
      ),
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{textAlign:"center",fontWeight:600}}>User Management Table</h2>
      <Table columns={columns} dataSource={filteredData} bordered pagination={{style:{justifyContent:"center"}}}/>
    </div>
  );
};

export default UserTable;
