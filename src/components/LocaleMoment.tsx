import MomentTimezone from 'moment-timezone';
import 'moment-timezone';
import React, {ReactNode} from 'react';
import Moment from 'react-moment';
import {useTranslation} from 'react-i18next';

interface IProps {
    children: ReactNode;
    locale?: string;
    showSeconds?: boolean;
    addMinutes?: number;
    showTime?: boolean;
    showAll?: boolean;
    fromNow?: boolean;
}

export default function LocaleMoment(props: IProps) {
    const {t, i18n} = useTranslation();

    let {
        children,
        locale,
        showSeconds,
        addMinutes,
        showTime,
        showAll,
        fromNow
    } = props;

    let moment;
    let timezone = MomentTimezone.tz.guess();
    locale = locale || i18n.language;

    let format =
        'YYYY[' +
        t('global$$moment::year') +
        ']MM[' +
        t('global$$moment::month') +
        ']DD[' +
        t('global$$moment::day') +
        '] ' +
        (showTime ? 'kk:mm' : '') +
        (showSeconds ? ':ss [' + t('global$$moment::second') + ']' : '');
    let currenTimeZoneDatetime = MomentTimezone.tz(
        children,
        'UTC'
    ).tz(timezone);
    switch (locale) {
        case 'zh-cn':
        case 'zh-tw':
        case 'zh':
            moment = (
                <Moment unix fromNow locale="zh-cn">
                    {children as string}
                </Moment>
            );
            //moment = <Moment unix add={{ minutes: addMinutes }} tz={timezone} format={format} locale="zh-cn">{children}</Moment>
            break;
        case 'en':
            moment = (
                <Moment unix fromNow locale="en">
                    {children as string}
                </Moment>
            );
            //moment = <Moment fromNow><Moment unix add={{ minutes: addMinutes }} tz={timezone} format={'YYYY-MM-DD kk:mm' + (showSeconds? ':ss':'')} locale='en'>{children}</Moment></Moment>
            break;
        default:
            moment = (
                <Moment unix fromNow locale="en">
                    {children as string}
                </Moment>
            );
        //moment = <Moment fromNow><Moment unix add={{ minutes: addMinutes }} tz={timezone} format={'YYYY-MM-DD kk:mm' + (showSeconds? ':ss':'')} locale='en'>{children}</Moment></Moment>
    }

    if (showAll) {
        switch (locale) {
            case 'zh-cn':
            case 'zh-tw':
            case 'zh':
                moment = (
                    <Moment
                        add={{minutes: addMinutes}}
                        tz={timezone}
                        format={fromNow ? undefined : format}
                        fromNow={fromNow}
                        locale="zh-cn"
                    >
                        {(currenTimeZoneDatetime as unknown) as string}
                    </Moment>
                );
                break;
            case 'en':
                moment = (
                    <Moment
                        add={{minutes: addMinutes}}
                        tz={timezone}
                        fromNow={fromNow}
                        format={
                            fromNow
                                ? undefined
                                : 'YYYY-MM-DD ' +
                                (showTime ? 'kk:mm' : '') +
                                (showSeconds ? ':ss' : '')
                        }
                        locale="en"
                    >
                        {(currenTimeZoneDatetime as unknown) as string}
                    </Moment>
                );
                break;
            default:
                moment = (
                    <Moment
                        add={{minutes: addMinutes}}
                        tz={timezone}
                        fromNow={fromNow}
                        format={
                            fromNow
                                ? undefined
                                : 'YYYY-MM-DD ' +
                                (showTime ? 'kk:mm' : '') +
                                (showSeconds ? ':ss' : '')
                        }
                        locale="en"
                    >
                        {(currenTimeZoneDatetime as unknown) as string}
                    </Moment>
                );
        }
    }
    return moment;
}
