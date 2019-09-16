import GoogleMapReact from 'google-map-react';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

let SearchBox = withTranslation()(class SearchBox extends React.Component<
  any,
  Readonly<any>
> {
  searchInput: any;
  searchBox: any;

  constructor(props: any) {
    super(props);
    this.searchInput = React.createRef();
  }

  componentDidMount() {
    const {
      mapsapi: { places }
    } = this.props;

    this.searchBox = new places.SearchBox(this.searchInput.current);
    this.searchBox.addListener(
      'places_changed',
      this.onPlacesChanged.bind(this)
    );
  }

  componentWillUnmount() {
    const {
      mapsapi: { event }
    } = this.props;

    event.clearInstanceListeners(this.searchBox);
  }

  onPlacesChanged() {
    const { onPlacesChanged } = this.props;

    if (onPlacesChanged) {
      onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  render() {
    let { t } = this.props;

    return (
      <input
        ref={this.searchInput}
        placeholder={t('global$$search address')}
        type="text"
        style={{}}
      />
    );
  }
} as any);

interface IState {
  mapsApiLoaded: boolean;
  mapInstance: any;
  mapsapi: any;
}

interface IProps {
  t: (key: string) => string;
  defaultLat?: number;
  defaultLng?: number;
  latitude?: number;
  longitude?: number;
  onClick: (data: any) => void;
}

class GoogleMap extends React.Component<IProps & WithTranslation, IState> {
  constructor(props: IProps & WithTranslation) {
    super(props);
    this.state = {
      mapsApiLoaded: false,
      mapInstance: null,
      mapsapi: null
    };
  }

  apiLoaded(map: any, maps: any) {
    this.setState({
      mapsApiLoaded: true,
      mapInstance: map,
      mapsapi: maps
    });
  }

  render() {
    let defaultLat = this.props.defaultLat || -1;
    let defaultLng = this.props.defaultLng || 67;
    return (
      <GoogleMapReact
        resetBoundsOnResize
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY || '' }}
        options={maps => {
          return {
            mapTypeControl: true,
            mapTypeId: maps.MapTypeId.HYBRID,
            mapTypeControlOptions: {
              style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: maps.ControlPosition.TOP_LEFT,
              mapTypeIds: [
                maps.MapTypeId.ROADMAP,
                maps.MapTypeId.TERRAIN,
                maps.MapTypeId.HYBRID
              ]
            }
          };
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          this.apiLoaded(map, maps);
        }}
        defaultCenter={{
          lat: defaultLat,
          lng: defaultLng
        }}
        center={{
          lat: this.props.latitude || defaultLat,
          lng: this.props.longitude || defaultLng
        }}
        defaultZoom={2}
        zoom={
          this.props.latitude !== defaultLat &&
          this.props.longitude !== defaultLng
            ? 20
            : 2
        }
        onClick={data => {
          this.props.onClick(data);
        }}
      >
        {/*{this.state.mapsApiLoaded &&*/}
        {/*<SearchBox map={this.state.mapInstance} mapsapi={this.state.mapsapi} />*/}
        {/*}*/}
        {this.props.children}
      </GoogleMapReact>
    );
  }
}

export default withTranslation()(GoogleMap);
