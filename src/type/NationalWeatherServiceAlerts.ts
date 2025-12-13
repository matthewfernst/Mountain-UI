export type NationalWeatherServiceAlert = {
    features: [
        {
            properties:
                | {
                      event: string; // "Winter Weather Advisory
                      headline: string; // "Winter Weather Advisory issued December 6 at 1:35PM MST until December 6 at 11:00PM MST by NWS Grand Junction CO"
                      description: string; // "* WHAT...Snow. Additional snow accumulations up to two inches. Winds\ngusting as high as 40 mph.\n\n* WHERE...Upper Yampa River Basin.\n\n* WHEN...Until 11 PM MST this evening.\n\n* IMPACTS...Travel could be hazardous to very difficult at times.";
                      instruction: string; // "Slow down and use caution while traveling. The latest road\nconditions for the state you are calling from can be obtained by\ncalling 5 1 1.";
                  }
                | undefined;
        }
    ];
    title: string;
    updated: string;
};
