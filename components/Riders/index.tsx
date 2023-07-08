import React from "react";
import { connect } from "react-redux";
import { Grid, Paper, Typography } from "@mui/material";

import { profileLoaded } from "store/api/profile";
import { RootState } from "store";

import RiderPlace from "../Map/RiderPlace";
import GoogleMap from "../Map/GoogleMap";

class Riders extends React.Component {
  mapProp = {
    center: {
      lat: 48.846901,
      lng: 2.31671,
    },
    zoom: 15,
  };

  riders = [
    {
      id: "1",
      name: "John Doe",
      rating: 5,
      remainingTime: "12 mins",
      show: false,
      lat: "48.846901",
      lng: "2.316710",
      path: [
        { lat: 18.558908, lng: -68.389916 },
        { lat: 18.558853, lng: -68.389922 },
        { lat: 18.558375, lng: -68.389729 },
        { lat: 18.558032, lng: -68.389182 },
        { lat: 18.55805, lng: -68.388613 },
        { lat: 18.558256, lng: -68.388213 },
        { lat: 18.558744, lng: -68.387929 },
      ],
    },
    // {
    //   id: '2',
    //   name: 'John Doe',
    //   rating: 5,
    //   remainingTime: '12 mins',
    //   show: false,
    //   lat: '43.65010756853323',
    //   lng: '3.9767257854931337',
    // },
    // {
    //   id: '3',
    //   name: 'John Doe',
    //   rating: 5,
    //   remainingTime: '12 mins',
    //   show: false,
    //   lat: '43.64987491924884',
    //   lng: '3.9748106882565004',
    // },
    // {
    //   id: '4',
    //   name: 'John Doe',
    //   rating: 5,
    //   remainingTime: '12 mins',
    //   show: false,
    //   lat: '43.65102408635164',
    //   lng: '3.976972548722504',
    // },
  ];

  render = () => {
    return (
      <Paper style={{ backgroundColor: "whitesmoke" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" color="secondary" sx={{ m: 4 }}>
              Livreurs
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ p: 1 }}>
            <GoogleMap
              defaultCenter={this.mapProp.center}
              defaultZoom={this.mapProp.zoom}
            >
              {this.riders.map((rider) => (
                <RiderPlace
                  key={rider.id}
                  show={rider.show}
                  rider={rider}
                  lat={rider.lat}
                  lng={rider.lng}
                />
              ))}
            </GoogleMap>
          </Grid>
        </Grid>
      </Paper>
    );
  };
}

export default connect((state: RootState) => ({
  isProfileLoaded: profileLoaded(state),
}))(Riders);
