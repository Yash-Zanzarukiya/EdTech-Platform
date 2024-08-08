import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const useCustomForm = (schema, defaultValues) => {
    return useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    })
}

export default useCustomForm