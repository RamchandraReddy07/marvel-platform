import { useState } from 'react';

import RemoveIcon from '@mui/icons-material/Remove';
import { Fab, Grid, Skeleton, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import DiscoveryLibrary from '../DiscoveryLibrary';

import styles from './styles';

const DiscoveryLibraryWindow = () => {
  const discoveryLibraries = useSelector(
    (state) => state.chat.discoveryLibraries
  );

  const [showDiscoveryLibrary, setShowDiscoveryLibraryWindow] = useState(false);

  /**
   * Returns a greeting message based on the current time of day.
   *
   * @return {string} The greeting message.
   */
  const greeting = () => {
    // Get the current hour of the day.
    const hours = new Date().getHours();

    // Determine the greeting based on the current hour.
    if (hours < 12) {
      // If the hour is before 12, return 'Good Morning'.
      return 'Good Morning';
    }
    if (hours < 18) {
      // If the hour is between 12 and 18 (exclusive), return 'Good Afternoon'.
      return 'Good Afternoon';
    }
    // If the hour is 18 or later, return 'Good Evening'.
    return 'Good Evening';
  };

  /**
   * Toggles the visibility of the discovery library sidebar.
   *
   * @return {void} No return value.
   */
  const toggleDiscoveryLibrarySidebar = () => {
    // Toggle the visibility of the discovery library sidebar by updating the state using the previous state.
    setShowDiscoveryLibraryWindow((prev) => !prev);
  };

  /**
   * Returns a JSX element representing a skeleton component for the discovery library window. The skeleton component consists of a Grid container with five Skeleton components, each representing a discovery library item. The grid container has a column direction and a height of 100%.
   *
   * @return {JSX.Element} The skeleton component for the discovery library window.
   */
  const librarySkeleton = () => (
    // Grid container with 100% height and column direction
    <Grid container height="100%" flexDirection="column">
      {/* Map over an array of length 5 */}
      {Array.from({ length: 5 }).map((_, index) => (
        // Skeleton component with specified props
        <Skeleton key={index} animation="wave" width="100%" height="20%" />
      ))}
    </Grid>
  );

  /**
   * Returns a JSX element representing an error message component.
   *
   * @return {JSX.Element} The error message component.
   */
  const renderErrorMessage = () => (
    <Grid {...styles.errorMessageStyle}>
      <Typography variant="h5">No Discovery Libraries Found</Typography>
    </Grid>
  );

  const getLibraryContent = () => {
    if (discoveryLibraries === null) {
      return renderErrorMessage();
    }

    if (discoveryLibraries.length === 0) {
      return librarySkeleton();
    }

    return discoveryLibraries.map((library) => (
      <DiscoveryLibrary key={library.id} library={library} />
    ));
  };

  return !showDiscoveryLibrary ? (
    <Grid {...styles.openDiscoveryLibraryContainer}>
      <Grid
        aria-label="open chat history"
        onClick={toggleDiscoveryLibrarySidebar}
        {...styles.toggleDiscoveryLibraryWindowButton(showDiscoveryLibrary)}
      >
        <Grid>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.3 5C8.90751 5 9.4 5.49249 9.4 6.1V7.2H10.5C11.1075 7.2 11.6 7.69249 11.6 8.3C11.6 8.90751 11.1075 9.4 10.5 9.4H9.4V10.5C9.4 11.1075 8.90751 11.6 8.3 11.6C7.69249 11.6 7.2 11.1075 7.2 10.5V9.4H6.1C5.49249 9.4 5 8.90751 5 8.3C5 7.69249 5.49249 7.2 6.1 7.2H7.2V6.1C7.2 5.49249 7.69249 5 8.3 5ZM17.1 5C17.5735 5 17.9938 5.30295 18.1435 5.7521L20.4922 12.797L26.2863 14.9701C26.7156 15.1311 27 15.5415 27 16C27 16.4585 26.7156 16.8689 26.2863 17.0299L20.4922 19.203L18.1435 26.2479C17.9938 26.697 17.5735 27 17.1 27C16.6265 27 16.2062 26.697 16.0565 26.2479L13.7078 19.203L7.91372 17.0299C7.48441 16.8689 7.2 16.4585 7.2 16C7.2 15.5415 7.48441 15.1311 7.91372 14.9701L13.7078 12.797L16.0565 5.7521C16.2062 5.30295 16.6265 5 17.1 5ZM9.4 20.4C10.0075 20.4 10.5 20.8925 10.5 21.5V22.6H11.6C12.2075 22.6 12.7 23.0925 12.7 23.7C12.7 24.3075 12.2075 24.8 11.6 24.8H10.5V25.9C10.5 26.5075 10.0075 27 9.4 27C8.79249 27 8.3 26.5075 8.3 25.9V24.8H7.2C6.59249 24.8 6.1 24.3075 6.1 23.7C6.1 23.0925 6.59249 22.6 7.2 22.6H8.3V21.5C8.3 20.8925 8.79249 20.4 9.4 20.4Z"
              fill="currentColor"
            />
          </svg>
        </Grid>
        <Grid>Discover</Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid {...styles.discoveryLibraryWindow}>
      <Grid {...styles.discoveryLibraryWindowHeader}>
        <Grid {...styles.discoveryLibraryWindowTitle}>
          <Typography {...styles.discoveryLibraryWindowTitleText}>
            {greeting()}
          </Typography>
        </Grid>
        <Fab
          aria-label="close discovery library"
          size="medium"
          onClick={toggleDiscoveryLibrarySidebar}
          {...styles.toggleDiscoveryLibraryWindowButton(showDiscoveryLibrary)}
        >
          <RemoveIcon />
        </Fab>
      </Grid>
      <Grid {...styles.discoveryLibraries}>{getLibraryContent()}</Grid>
    </Grid>
  );
};

export default DiscoveryLibraryWindow;
