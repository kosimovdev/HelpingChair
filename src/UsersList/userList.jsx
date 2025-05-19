import React, {useEffect, useState} from "react";
import axios from "axios";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
            setUsers(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Foydalanuvchilarni yuklashda xatolik:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Yuklanmoqda...</p>;
    }

    return (
        <div>
            <h2>Foydalanuvchilar Ro'yxati</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <strong>{user.name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;
