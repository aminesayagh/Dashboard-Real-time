import React, { memo, ReactNode, useCallback } from "react";
import { QueryKey, QueryFunction, UseQueryOptions, useQuery } from "@tanstack/react-query";
import Loading from "../components/ui/Loading";
import ErrorUi from "../components/ui/Error";
import { Lang } from "../../i18n/settings";
import { stringify } from "querystring";

interface QueryParams<T, E> extends UseQueryOptions<T, E> {
    queryKey: QueryKey;
    queryFn: QueryFunction<T>;
}

interface Props<T, E> {
    query: QueryParams<T, E>;
    lang?: Lang;
    children: ({ data }: { data: T }) => React.ReactElement | React.ReactElement[];
    loadingComponent?: ReactNode;
    errorComponent?: ReactNode;
}

function WrapperReactQuery<T, E = unknown>({ query, lang = 'en',children, loadingComponent, errorComponent }: Props<T, E>) {
    const { data, isLoading, error, isError } = useQuery<T, E>(query);

    const renderChildren = useCallback(() => {
        if (!children || !data) {
            return <ErrorUi lang={lang} message='No data' />;
        }
        return children({ data });
    }, [children, data, lang]);

    if (isLoading) {
        return loadingComponent || <Loading size='md' lang={lang} />;
    }

    if (isError && error) {
        const errorMessage = error instanceof Error ? error?.message : stringify(error);
        return errorComponent || <ErrorUi lang={lang} message={errorMessage} />;
    }

    return renderChildren();
}

export default memo(WrapperReactQuery);