import React from 'react';
import {TypographyProps} from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import {useTranslation} from 'react-i18next';

interface IProps extends TypographyProps {
    total: number;
    rowsPerPage: number;
    changePage: (event: any, page: number) => void;
    page: number;
    rowsPerPageOptions?: number[];
}

export default function Pagination(props: IProps) {
    const {t} = useTranslation();
    const {
        total,
        rowsPerPage,
        changePage,
        page,
        rowsPerPageOptions
    } = props;

    return <TablePagination
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        rowsPerPageOptions={rowsPerPageOptions}
        backIconButtonProps={{
            'aria-label': 'Previous Page'
        }}
        nextIconButtonProps={{
            'aria-label': 'Next Page'
        }}
        labelRowsPerPage={t('global$$rows per page:')}
        labelDisplayedRows={({from, to, count}) =>
            t('global$${{from}} - {{to}} of {{count}}', {
                from,
                to,
                count
            })
        }
        onChangePage={changePage}
    />;
}
