import { ref } from "vue";
import { useRouter } from "vue-router";

// 프로젝트 상화에 맞게 수정
interface ApiResponse<T> {
    data: {
        list?: T;
        data?: T;
        paging?: unknown;
    } & T;
    status?: number;
}

type ApiFunction<T, P extends unknown[]> = (...args: P) => Promise<ApiResponse<T>>;

export const useApi = <T, P extends unknown[]>(
    apiFunction: ApiFunction<T, P>, 
    initialParams: P, 
    callOnInit: boolean = true
) => {
    const router = useRouter();

    const apiData = ref<T | null>(null);
    const apiPaging = ref<unknown>(null);
    const isLoading = ref<boolean>(false);

    let prevParamsJson = '';

    const callApi = async (...params: P) => {
        const currentParams = params.length > 0 ? params : initialParams;

        if ( !(currentParams[0] instanceof FormData) ) {
            const paramsJson = JSON.stringify(currentParams);
            if (paramsJson === prevParamsJson) return;
            prevParamsJson = paramsJson;
        }

        isLoading.value = true;

        try {
            const res = await apiFunction(...currentParams);

            if ( res?.data ) {
                const { list, data, paging } = res.data;

                apiData.value = list ?? data ?? res.data;
                if (paging) apiPaging.value = paging;
            }

            return res?.data;
        } catch (error: unknown) {
            if ( error && typeof error === 'object' && 'status' in error ) {
                if ( (error as { status: number }).status === 999 ) {
                    router.push("/error-network");
                }
            }

            console.log(error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    if ( callOnInit ) {
        callApi(...initialParams);
    }

    return {
        apiData, apiPaging, isLoading,
        callApi,
    };
}
