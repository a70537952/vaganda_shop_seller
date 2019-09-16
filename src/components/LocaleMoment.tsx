import MomentTimezone from 'moment-timezone';
import 'moment-timezone';
import React from 'react';
import Moment from 'react-moment';
import { Translation, withTranslation, WithTranslation } from 'react-i18next';

interface IProps {
  locale?: string;
  showSeconds?: boolean;
  addMinutes?: number;
  showTime?: boolean;
  showAll?: boolean;
  fromNow?: boolean;
}

class LocaleMoment extends React.Component<
  IProps & WithTranslation,
  Readonly<any>
> {
  render() {
    return (
      <Translation>
        {(t, { i18n }) => {
          let moment;
          let timezone = MomentTimezone.tz.guess();
          let locale = this.props.locale || i18n.language;
          let showSeconds = this.props.showSeconds;
          let addMinutes = this.props.addMinutes;
          let showTime = this.props.showTime;
          let fromNow = this.props.fromNow;

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
            this.props.children,
            'UTC'
          ).tz(timezone);
          switch (locale) {
            case 'zh-cn':
            case 'zh-tw':
            case 'zh':
              moment = (
                <Moment unix fromNow locale="zh-cn">
                  {this.props.children as string}
                </Moment>
              );
              //moment = <Moment unix add={{ minutes: addMinutes }} tz={timezone} format={format} locale="zh-cn">{this.props.children}</Moment>
              break;
            case 'en':
              moment = (
                <Moment unix fromNow locale="en">
                  {this.props.children as string}
                </Moment>
              );
              //moment = <Moment fromNow><Moment unix add={{ minutes: addMinutes }} tz={timezone} format={'YYYY-MM-DD kk:mm' + (showSeconds? ':ss':'')} locale='en'>{this.props.children}</Moment></Moment>
              break;
            default:
              moment = (
                <Moment unix fromNow locale="en">
                  {this.props.children as string}
                </Moment>
              );
            //moment = <Moment fromNow><Moment unix add={{ minutes: addMinutes }} tz={timezone} format={'YYYY-MM-DD kk:mm' + (showSeconds? ':ss':'')} locale='en'>{this.props.children}</Moment></Moment>
          }

          if (this.props.showAll) {
            switch (locale) {
              case 'zh-cn':
              case 'zh-tw':
              case 'zh':
                moment = (
                  <Moment
                    add={{ minutes: addMinutes }}
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
                    add={{ minutes: addMinutes }}
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
                    add={{ minutes: addMinutes }}
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
        }}
      </Translation>
    );
  }
}

export default withTranslation()(LocaleMoment);
