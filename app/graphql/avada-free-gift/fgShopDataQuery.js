export const FG_SHOP_DATA_QUERY = `#graphql
query {
    localization {
        language {
            name
            isoCode
        }
        country {
            currency {
                isoCode
            }
            isoCode
        }
    }
}
`;
