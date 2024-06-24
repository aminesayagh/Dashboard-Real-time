import React from "react";
import { QueryKey, QueryFunction, UseQueryOptions, useQuery } from "@tanstack/react-query";
import Loading from "@ui/Loading";
import Error from "@ui/Error";
import { Lang } from "@i18n/settings";
import { stringify } from "querystring";

interface QueryParams<T, E> extends UseQueryOptions<T, E> {
    queryKey: QueryKey;
    queryFn: QueryFunction<T>;
}

interface Props<T, E> {
    query: QueryParams<T, E>;
    lang?: Lang;
    children: ({ data }: { data: T }) => React.ReactElement | React.ReactElement[];
}

export default function WrapperReactQuery<T, E = unknown>({ query, lang = 'en',children }: Props<T, E>) {
    const { data, isLoading, error, isError } = useQuery<T, E>(query);

    if (isLoading) {
        return <Loading size='md' lang={lang} />;
    }

    if (isError && error) {
        return <Error lang={lang} message={stringify(error)} />;
    }

    if (!children || !data) {
        return <Error lang={lang} message='No data' />;
    }
    
    return <>{children({ data })}</>;
}