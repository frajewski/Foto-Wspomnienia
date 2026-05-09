import { act, renderHook } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { useLocation } from '@/hooks/useLocation';

const mockedLocation = Location as jest.Mocked<typeof Location>;

describe('useLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return granted with coords when permission granted and GPS enabled', async () => {
    mockedLocation.getForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    });
    mockedLocation.hasServicesEnabledAsync.mockResolvedValue(true);
    mockedLocation.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: 50.06143,
        longitude: 19.93658,
        accuracy: 12,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: 1_700_000_000_000,
    });

    const { result } = renderHook(() => useLocation());

    let response: Awaited<ReturnType<typeof result.current.getCurrentLocation>> | undefined;
    await act(async () => {
      response = await result.current.getCurrentLocation();
    });

    expect(response).toEqual({
      status: 'granted',
      coords: {
        latitude: 50.06143,
        longitude: 19.93658,
        accuracy: 12,
        timestamp: 1_700_000_000_000,
      },
    });
  });

  it('should return denied/permission-blocked when canAskAgain is false', async () => {
    mockedLocation.getForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.DENIED,
      granted: false,
      canAskAgain: false,
      expires: 'never',
    });

    const { result } = renderHook(() => useLocation());

    let response: Awaited<ReturnType<typeof result.current.getCurrentLocation>> | undefined;
    await act(async () => {
      response = await result.current.getCurrentLocation();
    });

    expect(response).toMatchObject({
      status: 'denied',
      reason: 'permission-blocked',
    });
    expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('should return error/no-gps when location services are disabled', async () => {
    mockedLocation.getForegroundPermissionsAsync.mockResolvedValue({
      status: Location.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    });
    mockedLocation.hasServicesEnabledAsync.mockResolvedValue(false);

    const { result } = renderHook(() => useLocation());

    let response: Awaited<ReturnType<typeof result.current.getCurrentLocation>> | undefined;
    await act(async () => {
      response = await result.current.getCurrentLocation();
    });

    expect(response).toMatchObject({
      status: 'error',
      reason: 'no-gps',
    });
  });
});
