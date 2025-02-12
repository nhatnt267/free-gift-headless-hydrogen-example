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
    shop {
        giftCampaigns: metafield(namespace: "avada_free_gifts", key: "giftCampaigns") {
            value
        }
        configSettings: metafield(namespace: "avada_free_gifts", key: "configSettings") {
            value
        }
        congratsBarDesignSetting: metafield(namespace: "avada_free_gifts", key: "congratsBarDesignSetting") {
            value
        }
        dealBadgeDesignSetting: metafield(namespace: "avada_free_gifts", key: "dealBadgeDesignSetting") {
            value
        }
        promotionCardDesignSetting: metafield(namespace: "avada_free_gifts", key: "promotionCardDesignSetting") {
            value
        }
        volumeDiscountDesignSetting: metafield(namespace: "avada_free_gifts", key: "volumeDiscountDesignSetting") {
            value
        }
        dealOfTheDayDesignSetting: metafield(namespace: "avada_free_gifts", key: "dealOfTheDayDesignSetting") {
            value
        }
        giftBoxDesignSetting: metafield(namespace: "avada_free_gifts", key: "giftBoxDesignSetting") {
            value
        }
        popUpDesignSetting: metafield(namespace: "avada_free_gifts", key: "popUpDesignSetting") {
            value
        }
    }
}
`;
