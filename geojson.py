import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

input_csv = "raw_data/NYC_Accidents_2020.csv"
output_geojson = "accidents.geojson"

column_names = ['CRASH_DATE', 'CRASH_TIME', 'BOROUGH', 'ZIP_CODE', 'LATITUDE', 'LONGITUDE', 'LOCATION', 'ON_STREET_NAME', 'CROSS_STREET_NAME'] + [f'EXTRA_{i}' for i in range(21)] 

df = pd.read_csv(input_csv, skiprows=4, header=None, names=column_names)

df_clean = df[df['LATITUDE'].notnull() & df['LONGITUDE'].notnull() & df['BOROUGH'].notnull()][['LATITUDE', 'LONGITUDE', 'BOROUGH']]

geometry = [Point(xy) for xy in zip(df_clean['LONGITUDE'], df_clean['LATITUDE'])]
gdf = gpd.GeoDataFrame(df_clean, geometry=geometry, crs="EPSG:4326")

gdf.to_file(output_geojson, driver="GeoJSON")

