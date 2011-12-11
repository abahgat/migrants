function DataCollector() {

    this.collect = function() {
        return fetchFriends();
    }

    var locations = {}

    function resolveLocations(locIds) {
        // it would be better to batch these calls, if possible
        for (var i = 0, l = locIds.length; i < l; i++) {
            var id = locIds[i];
            if (!locations[id]) {
                locations[id] = true; // FIXME a placeholder
                FB.api('/' + id, {
                    fields: ['location', 'name']
                },
                function(response) {
                    console.log(response.id + ' ' + response.name + ' '
                    + JSON.stringify(response.location));
                    locations[id] = response.location;
                });
            }
        }
        return locations;
    }

    function fetchFriends() {

        var stats = {
            none: 0,
            just_location: 0,
            just_hometown: 0,
            both: 0,
            different: 0,
            log: function() {
                console.log("Both location and hometown: "
                + stats.both
                + " (different: "
                + stats.different
                + ") hometown only: "
                + stats.just_hometown
                + " location only: "
                + stats.just_location
                + ", TOTAL "
                + (stats.both + stats.just_hometown
                + stats.just_location + stats.none));
            }
        }

        var current_locations = {};
        var hometowns = {};

        var location_ids = [];

        FB.api('/me/friends', {
            fields: ['name', 'location', 'hometown']
        },
        function(response) {
            var friends = response.data;
            for (var i = 0, l = friends.length; i < l; i++) {
                var friend = friends[i];

                console.log(JSON.stringify(friend));

                var name = friend.name;
                var location = friend.location;
                if (location) {
                    increment(current_locations, location.id);
                    location_ids.push(location.id);
                }

                var hometown = friend.hometown;
                if (hometown) {
                    increment(hometowns, hometown.id);
                    location_ids.push(hometown.id);
                }

                if (location && hometown) {
                    stats.both++;
                    if (location.id != hometown.id) {
                        stats.different++;
                    }
                } else if (location) {
                    stats.just_location++;
                } else if (hometown) {
                    stats.just_hometown++;
                } else {
                    stats.nothing++;
                }
            }

            stats.log();

            console.log("hometowns: " + mapSize(hometowns) + " locations: "
            + mapSize(current_locations));

            // location_ids array may contain dupes
            return {
                stats: stats,
                locations: resolveLocations(location_ids),
                hometowns: hometowns,
                current_locations: current_locations
            }

        });

    }

    /* util functions */
    function increment(map, value) {
        if (map[value]) {
            ++map[value];
        } else {
            map[value] = 1;
        }
    }

    function mapSize(map) {
        var size = 0;
        for (key in map) {
            if (map.hasOwnProperty(key))
            ++size;
        }
        return size;
    }
}