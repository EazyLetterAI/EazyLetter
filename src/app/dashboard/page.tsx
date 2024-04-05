import { EditUserInfo } from "../_components/edit-info";
import toast, { Toaster } from 'react-hot-toast';


export default function Dashboard() {
    return (
        <main className="text-center">
            <h1 className="text-4xl">Dashboard</h1>
            <EditUserInfo/>
            <Toaster position = "bottom-center"/>
        </main>
    );
}