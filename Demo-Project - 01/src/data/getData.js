import { fetchAuthUserAction } from "@/actions";
export async function getData() {
    const result = await fetchAuthUserAction();
    if (result.success) {
        return result.data;
    } else {
        throw new Error(result.message);
    }
}