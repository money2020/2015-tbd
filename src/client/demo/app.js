/* global angular */
/* global escape */
/* global console */
'use strict'; // jshint ignore:line

var TEST_MODE = false;

var humanizer = humanizeDuration.humanizer();
humanizer.languages.shortEn = {
  y: function(x) { return x + "y"; },
  mo: function(x) { return x + "mo"},
  d: function(x) { return x + "d"},
  h: function(x) { return x + "h"}
};

var API_HOST = "http://localhost:5000"

// Lol free globals in my angular? We dont play by the rules
var BUNCH_ROUTES = {
    '/bunch/home': {
        title: 'B/Home',
        templateUrl: '/includes/bunch/home.html'
    },
    '/bunch/groups': {
        title: 'B/groups',
        templateUrl: '/includes/bunch/groups/list.html',
        controller: 'BunchGroupList'
    },
    '/bunch/groups/create': {
        title: 'B/groups/create',
        templateUrl: '/includes/bunch/groups/create.html',
        controller: 'BunchGroupCreate'
    },
    '/bunch/groups/:groupId': {
        title: 'B/groups/details',
        templateUrl: '/includes/bunch/groups/details.html',
        controller: 'BunchGroupDetails'
    },
    '/bunch/login': {
        title: 'B/login',
        templateUrl: '/includes/bunch/login.html',
        controller: 'BunchLogin'
    },
    '/bunch/signup': {
        title: 'B/signup',
        templateUrl: '/includes/bunch/signup.html',
        controller: 'BunchSignup'
    },
    '/bunch/profile/cards': {
        title: 'B/profile/cards',
        templateUrl: '/includes/bunch/profile/cards-list.html',
        controller: 'BunchProfileCards'
    }
}

angular
    .module('lumx-demo', [
        'ngRoute',
        'lumx',
        'hljs',
        'Services',
        'Bunch'
    ])
    .config(function($locationProvider, $routeProvider)
    {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider.
            when('/', {
                templateUrl: '/includes/homepage/homepage.html'
            }).
            when('/getting-started/installation', {
                templateUrl: '/includes/start/installation.html'
            }).
            when('/getting-started/customization', {
                templateUrl: '/includes/start/customization.html'
            }).
            when('/getting-started/contribute', {
                templateUrl: '/includes/start/contribute.html'
            }).
            when('/css/mixins', {
                templateUrl: '/includes/css/mixins.html'
            }).
            when('/css/typography', {
                templateUrl: '/includes/css/typography.html'
            }).
            when('/css/colors', {
                templateUrl: '/includes/css/colors.html'
            }).
            when('/css/flexbox', {
                templateUrl: '/includes/modules/flexbox/flexbox.html'
            }).
            when('/css/buttons', {
                templateUrl: '/includes/modules/button/button.html'
            }).
            when('/css/fab', {
                templateUrl: '/includes/modules/fab/fab.html'
            }).
            when('/css/icons', {
                templateUrl: '/includes/modules/icon/icon.html'
            }).
            when('/css/lists', {
                templateUrl: '/includes/modules/list/list.html'
            }).
            when('/css/data-table', {
                templateUrl: '/includes/modules/data-table/data-table.html'
            }).
            when('/css/cards', {
                templateUrl: '/includes/modules/card/card.html'
            }).
            when('/css/checkboxes', {
                templateUrl: '/includes/modules/checkbox/checkbox.html'
            }).
            when('/css/radio-buttons', {
                templateUrl: '/includes/modules/radio-button/radio-button.html'
            }).
            when('/css/switches', {
                templateUrl: '/includes/modules/switch/switch.html'
            }).
            when('/css/toolbars', {
                templateUrl: '/includes/modules/toolbar/toolbar.html'
            }).
            when('/directives/dropdowns', {
                templateUrl: '/includes/modules/dropdown/dropdown.html'
            }).
            when('/directives/tabs', {
                templateUrl: '/includes/modules/tabs/tabs.html'
            }).
            when('/directives/text-fields', {
                templateUrl: '/includes/modules/text-field/text-field.html'
            }).
            when('/directives/search-filter', {
                templateUrl: '/includes/modules/search-filter/search-filter.html'
            }).
            when('/directives/selects', {
                templateUrl: '/includes/modules/select/select.html'
            }).
            when('/directives/file-inputs', {
                templateUrl: '/includes/modules/file-input/file-input.html'
            }).
            when('/directives/tooltips', {
                templateUrl: '/includes/modules/tooltip/tooltip.html'
            }).
            when('/directives/dialogs', {
                templateUrl: '/includes/modules/dialog/dialog.html'
            }).
            when('/directives/date-picker', {
                templateUrl: '/includes/modules/date-picker/date-picker.html'
            }).
            when('/directives/thumbnails', {
                templateUrl: '/includes/modules/thumbnail/thumbnail.html'
            }).
            when('/directives/scrollbar', {
                templateUrl: '/includes/modules/scrollbar/scrollbar.html'
            })
            .when('/services/notifications', {
                templateUrl: '/includes/modules/notification/notification.html'
            })
            .when('/services/progress', {
                templateUrl: '/includes/modules/progress/progress.html'
            })
            ;
        Object.keys(BUNCH_ROUTES).forEach(function(key) {
            $routeProvider.when(key, BUNCH_ROUTES[key]);
        });
    })
    .controller('AppController', function($http, $rootScope, $scope, $location, LxNotificationService, LxDialogService, LxProgressService, Sidebar)
    {
        $rootScope.bunchRoutes = BUNCH_ROUTES;
        $scope.Sidebar = Sidebar;
        $location.path('/bunch/groups');

        $scope.checkHome = function()
        {
            return $location.path() === '/';
        };

        $scope.isOnGroupDetails = function() {
            return /\/bunch\/groups\/\d+/.test($location.path());
        };

        $scope.repo = {
            lastCommit: {
                date: undefined,
                sha: undefined,
                url: undefined
            },
            lastRelease: {
                name: undefined,
                tag: undefined
            }
        };

        $http.get('https://api.github.com/repos/lumapps/lumx/git/refs/heads/master').success(function(master)
        {
            $http.get(master.object.url).success(function(lastCommit)
            {
                $scope.repo.lastCommit.date = new Date(lastCommit.author.date);
                $scope.repo.lastCommit.sha = lastCommit.sha;
                $scope.repo.lastCommit.url = lastCommit.html_url;
            });
        });

        $http.get('https://api.github.com/repos/lumapps/lumx/releases').success(function(lastReleases)
        {
            var lastRelease = lastReleases[0] ? lastReleases[0] : lastReleases;
            $scope.repo.lastRelease.name = lastRelease.name;
            $scope.repo.lastRelease.tag = lastRelease.tag_name;
            $scope.repo.lastRelease.url = lastRelease.zipball_url;
        });

        $scope.people = [
            { name: 'Adam',      email: 'adam@email.com',      age: 10 },
            { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
            { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
            { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
            { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
            { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
            { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
            { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
        ];

        $scope.selectSections = {
            'Sub header 1': [
                { uid: '1', name: 'Adam' },
                { uid: '2', name: 'Amalie' },
                { uid: '3', name: 'Wladimir' },
                { uid: '4', name: 'Samantha' }
            ],
            '<i class="mdi mdi-android"></i> Sub header 2': [
                { uid: '5', name: 'Estefanía' },
                { uid: '6', name: 'Natasha' },
                { uid: '7', name: 'Nicole' }
            ]
        };

        $scope.ajax = {
            selected: 'Inception',
            list: [],
            update: function(newFilter)
            {
                if (newFilter)
                {
                    $scope.ajax.loading = true;
                    $http.get('http://www.omdbapi.com/?s=' + escape(newFilter)).
                        success(function(data)
                        {
                            $scope.ajax.list = data.Search;
                            $scope.ajax.loading = false;
                        }).
                        error(function()
                        {
                            $scope.ajax.loading = false;
                        });
                }
                else
                {
                    $scope.ajax.list = false;
                }
            },
            toModel: function(data, callback)
            {
                if (data)
                {
                    callback(data.Title);
                }
                else
                {
                    callback();
                }
            },
            toSelection: function(data, callback)
            {
                if (data)
                {
                    $http.get('http://www.omdbapi.com/?s=' + escape(data)).
                        success(function(response)
                        {
                            callback(response.Search[0]);
                        }).
                        error(function()
                        {
                            callback();
                        });
                }
                else
                {
                    callback();
                }
            },
            loading: false
        };

        $scope.cbSelect = {
            exec: function(newVal, oldVal)
            {
                LxNotificationService.notify('Change detected!');
                console.log('oldVal: ', oldVal);
                console.log('newVal: ', newVal);
            }
        };

        $scope.selects = {
            selectedPerson: undefined,
            selectedPersons: [$scope.people[2], $scope.people[4]],
            selectedPersons2: []
        };

        $scope.tree = [
        {
            id: 1,
            children: [
            {
                id: 11,
                children: [{id: 111}]
            },
            {
                id: 12,
                children: [{id: 121}, {id: 122}]
            },
            {
                id: 13
            }]
        },
        {
            id: 2
        },
        {
            id: 3,
            children: [
            {
                id: 32,
                children: [{id: 321}, {id: 322}, {id: 323}]
            }]
        }];

        $scope.selectedTags = [$scope.people[1], $scope.people[2]];

        $scope.scrollbarHeight = 150;
        $scope.scrollbarContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi commodo varius nisl, quis tempor nunc scelerisque eget. Nam ultricies nulla et felis sollicitudin, eget facilisis neque fringilla. Aliquam malesuada, massa sit amet vehicula ultrices, erat tortor pretium enim, at mattis enim tellus eget felis. Duis euismod mollis ligula nec commodo. Aenean laoreet molestie ex id porta. Etiam vitae libero ac augue pellentesque tempor at id felis. Donec finibus purus non tortor sollicitudin consequat. Curabitur sit amet tincidunt odio. Pellentesque in accumsan nibh. Nulla quis rutrum lectus.';

        $scope.dropdownAlert = function()
        {
            LxNotificationService.info('Clicked!');
        };

        $scope.changeScrollbarHeight = function(height)
        {
            $scope.scrollbarHeight = height;
        };

        $scope.changeScrollbarContent = function(content)
        {
            $scope.scrollbarContent = content;
        };

        $scope.opendDialog = function(dialogId)
        {
            LxDialogService.open(dialogId);
        };

        $scope.$on('lx-dialog__open-start', function(event, data)
        {
            console.log('open start', data);
        });

        $scope.$on('lx-dialog__open-end', function(event, data)
        {
            console.log('open end', data);
        });

        $scope.$on('lx-dialog__close-start', function(event, data)
        {
            console.log('close start', data);
        });

        $scope.$on('lx-dialog__close-end', function(event, data)
        {
            console.log('close end', data);
        });

        $scope.closingDialog = function()
        {
            LxNotificationService.info('Dialog closed!');
        };

        $scope.scrollEndDialog = function()
        {
            LxNotificationService.info('Dialog scroll end!');
        };

        $scope.showCircularProgress = function()
        {
            LxProgressService.circular.show('primary', '#progress');
        };

        $scope.showSmallCircularProgress = false;

        $scope.toggleSmallCircularProgress = function()
        {
            $scope.showSmallCircularProgress = !$scope.showSmallCircularProgress;
        };

        $scope.showSmallLinearProgress = false;

        $scope.toggleSmallLinearProgress = function()
        {
            $scope.showSmallLinearProgress = !$scope.showSmallLinearProgress;
        };

        $scope.hideCircularProgress = function()
        {
            LxProgressService.circular.hide();
        };

        $scope.showLinearProgress = function()
        {
            LxProgressService.linear.show('primary', '#progress');
        };

        $scope.hideLinearProgress = function()
        {
            LxProgressService.linear.hide();
        };

        $scope.searchFilter = {
            first: '',
            second: '',
            third: '',
            fourth: ''
        };

        $scope.textFields = {
            disabled: 'LumApps',
            firstName: 'Leeloo',
            lastName: '',
            firstEmail: 'bad-email',
            secondEmail: 'hello@lumapps.com',
            thirdEmail: 'hello@lumapps.com',
            description: '',
            disabledDark: 'LumApps',
            firstNameDark: 'Leeloo',
            lastNameDark: '',
            firstEmailDark: 'bad-email',
            secondEmailDark: 'hello@lumapps.com',
            thirdEmailDark: 'hello@lumapps.com',
            descriptionDark: ''
        };

        $scope.ctrlData = {
            activeTab: 1
        };

        $scope.emailValidation = function(email)
        {
            return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(email);
        };

        $scope.$watch('searchFilter.first', function(newVal, oldVal)
        {
            console.log("Filter changed: '" + newVal + "' from '" + oldVal + "'");
        });

        $scope.datepicker = {
            date: new Date()
        };

        var tabIndex = 4;
        $scope.tabs = [
            { heading: 'Tab 1', content: 'Tab 1 content' },
            { heading: 'Tab 2', content: 'Tab 2 content' },
            { heading: 'Tab 3', content: 'Tab 3 content' }
        ];

        $scope.addTab = function()
        {
            $scope.tabs.push({ heading: 'Tab ' + tabIndex, content: 'Tab ' + tabIndex + ' content' });
            ++tabIndex;
        };

        $scope.removeFirstTab = function()
        {
            $scope.removeTab(0);
        };

        $scope.removeTab = function(idx)
        {
            if ($scope.tabs.length > idx)
            {
                $scope.tabs.splice(idx, 1);
            }
        };

        $scope.addPerson = function()
        {
            $scope.people.push({ name: 'Lorem', email: 'lorem@email.com', age: 99 });
        };

        $scope.thumbnail = '/images/placeholder/1-horizontal.jpg';
        $scope.thumbnailWidth = 60;
        $scope.thumbnailHeight = 60;

        $scope.updateThumbnail = function()
        {
            $scope.thumbnail = '/images/placeholder/2-vertical.jpg';
            $scope.thumbnailWidth = 150;
            $scope.thumbnailHeight = 80;
        };

        $scope.notify = function(type)
        {
            if (type === 'simple')
            {
                LxNotificationService.notify('Lorem Ipsum');
            }
            else if (type === 'sticky')
            {
                LxNotificationService.notify('Lorem Ipsum', undefined, true);
            }
            else if (type === 'icon')
            {
                LxNotificationService.notify('Lorem Ipsum', 'android');
            }
            else if (type === 'color')
            {
                LxNotificationService.notify('Lorem Ipsum', 'android', false, 'green');
            }
            else if (type === 'info')
            {
                LxNotificationService.info('Lorem Ipsum');
            }
            else if (type === 'success')
            {
                LxNotificationService.success('Lorem Ipsum');
            }
            else if (type === 'warning')
            {
                LxNotificationService.warning('Lorem Ipsum');
            }
            else if (type === 'error')
            {
                LxNotificationService.error('Lorem Ipsum');
            }
        };

        $scope.alert = function()
        {
            LxNotificationService.alert('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.', 'Ok', function(answer)
            {
                console.log(answer);
            });
        };

        $scope.confirm = function()
        {
            LxNotificationService.confirm('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper pharetra eu augue.', { cancel:'Disagree', ok:'Agree' }, function(answer)
            {
                console.log(answer);
            });
        };
    });


angular
    .module('Bunch', [])
    .controller('BunchGroupList', function($scope, $location, BunchAPI) {
        $scope.state = {
            loading: true
        ,   filters: {}
        ,   groups: []
        };
        $scope.actions = {
            groups: {
                create: function() {
                    $location.path("/bunch/groups/create");
                },
                details: function(group) {
                    $location.path(group.url);
                }
            }
        };
        BunchAPI.groups.list().then(function(groups) {
            groups = groups.map(function(group) {
                var peersWithCashouts = group.cashouts.map(function(cashout) {
                    return cashout.peer.id;
                });
                group.peers = group.peers.reduce(function(result, peer) {
                    if (!result.all) result.all = [];
                    if (!result.paid) result.paid = [];
                    if (!result.unpaid) result.unpaid = [];
                    var collection = (peersWithCashouts.indexOf(peer.id) != -1) ? result.paid : result.unpaid;
                    collection.push(peer);
                    result.all.push(peer);
                    return result;
                }, {});
                group.url = "/bunch/groups/" + group.id;
                group.completed = (group.peers.unpaid.length == 0);
                return group;
            });
            $scope.state.loading = false;
            $scope.state.groups = groups;
            $scope.state.completedGroups = groups.filter(function(x) { return x.completed; });
            $scope.state.incompleteGroups = groups.filter(function(x) { return !x.completed; });
        });
    })
    .controller('BunchGroupCreate', function($scope, $q, $location, TestGroup, BunchAPI) {
        $scope.state = {
            params: {
                groupName: 'New Group'
            ,   amountPerInterval: null
            ,   payoutPerInterval: null
            ,   peers: []
            }
        ,   lastChanged: null
        };

        $q.all([
            BunchAPI.users.list()
        ,   BunchAPI.vendors.list()
        ]).then(function(results) {
            $scope.state.users = results[0];
            $scope.state.vendors = results[1];
        });

        $scope.create = function() {
            // var logo = "/images/placeholder/1-square.jpg";
            // var id = Math.floor(Math.random() * 1000);
            // var peers = $scope.state.params.peers.map(function(peer) {
            //     return peer.id;
            // });

            var groupModel = {
                name: $scope.state.params.groupName
            ,   vendor: [$scope.state.params.vendor.id]
            ,   payoutPerInterval: parseInt($scope.state.params.payoutPerInterval)
            ,   amountPerInterval: parseInt($scope.state.params.amountPerInterval)
            ,   peers: $scope.state.params.peers.map(function(peer) {
                    return peer.id;
                })
            };

            // var nextTimestamp = moment.utc().add($scope.state.params.peers.length, 'months');
            // var group = new TestGroup(id, $scope.state.params.groupName, logo, nextTimestamp);
            BunchAPI.groups.create(groupModel).then(function() {
                $location.path("/bunch/groups");
            });
        };

        $scope.change = function(key, value) {
            $scope.state.lastChanged = key;
            $scope.state.lastChangedValue = value;
        }

        function calculateAmountPerInterval(payoutPerInterval, peerCount, round) {
            var value = payoutPerInterval / peerCount;
            if (Number.isNaN(value)) return null;
            var value = round? value.toFixed(0) : value.toFixed(2);
            return parseFloat(value);
        }

        $scope.$watch('state.params.amountPerInterval', function(amountPerInterval) {
            if (amountPerInterval == null) {
                $scope.state.params.payoutPerInterval = null;
                return;
            }
            $scope.state.lastPressed = 'amount';
            var value = $scope.state.params.peers.length * amountPerInterval;
            if (Number.isNaN(value)) return;
            if ($scope.state.lastChanged == 'payout') return;
            $scope.state.params.payoutPerInterval = parseFloat(value.toFixed(2));
        });

        $scope.$watch('state.params.peers.length', function(peerCount) {
            if (peerCount === null || peerCount === undefined) return;
            var payoutPerInterval = $scope.state.params.payoutPerInterval;
            $scope.state.params.amountPerInterval = calculateAmountPerInterval(payoutPerInterval, peerCount, true);
        });

        $scope.$watch('state.params.payoutPerInterval', function(payoutPerInterval) {
            console.log("Payout changed:", payoutPerInterval);
            if (payoutPerInterval === null) {
                $scope.state.params.amountPerInterval = null;
                return;
            }
            var peerCount = $scope.state.params.peers.length;
            if ($scope.state.lastChanged == 'amount') return;
            $scope.state.params.amountPerInterval = calculateAmountPerInterval(payoutPerInterval, peerCount);
        });

    })
    .controller('BunchGroupDetails', function($q, $rootScope, $scope, $timeout, $routeParams, $location, Utils, LxNotificationService, DatetimeUtils, BunchAPI) {
        $scope.state = {group: null, loading: true};

        if (!$routeParams.groupId) {
            LxNotificationService.error("Sorry, but that group could not be loaded.");
            $location.path("/bunch/groups");
        }

        $rootScope.cycle = function() {
            var SPEED = 33;
            function runTimestampCountdown() {
                var deferred = $q.defer();
                var tickDown = function(callback) {
                    var group = $scope.state.group.original;
                    group.nextTimestamp = moment.utc(group.nextTimestamp).subtract(1, 'day');
                    $scope.state.group = group = processGroup(group);
                    var sum = Object.keys(group.timeLeft).reduce(function(sum, key) {
                        if (key == "all") return sum;
                        return sum + group.timeLeft[key];
                    }, 0)
                    if (sum != 0) {
                        return $timeout(tickDown, SPEED);
                    } else {
                        return $timeout(function() { deferred.resolve(); }, 0);
                    }
                };
                tickDown();
                return deferred.promise;
            }

            runTimestampCountdown()
            .then(function() {
                BunchAPI.runCycle();
            }).then(function() {
                refresh();
            });
        }

        function processGroup(group) {
            var now = moment();
            var humanized = DatetimeUtils.humanizeTimeBetween(now, group.nextTimestamp, ["mo", "w", "d"])

            group.original = Utils.copy(group);
            var result = {months:0, weeks:0, days:0, hours:0, minutes:0};
            console.log(humanized);
            humanized.replace(/ /g, '').split(',').forEach(function(token) {
                var type = token.replace(/\d+/g, '');
                var number = parseInt(token.replace(/\D+/g, ''));
                if (type == "months" || type == "month") {
                    result.months = number;
                }
                else if (type == "weeks" || type == "week") {
                    result.weeks = number;
                }
                else if (type == "days" || type == "day") {
                    result.days = number;
                }
                else if (type == "hours" || type == "hour") {
                    result.hours = number;
                }
            });
            result.all = humanized;
            group.timeLeft = result;

            var peersWithCashouts = group.cashouts.map(function(cashout) {
                return cashout.peer.id;
            });
            console.log("Peers with cashouts:", peersWithCashouts);
            group.peers = group.peers.reduce(function(result, peer) {
                if (!result.all) result.all = [];
                if (!result.paid) result.paid = [];
                if (!result.unpaid) result.unpaid = [];
                console.log(peersWithCashouts.indexOf(peer.id), peer.id, peersWithCashouts)
                var collection = (peersWithCashouts.indexOf(peer.id) != -1) ? result.paid : result.unpaid;
                collection.push(peer);
                result.all.push(peer);
                return result;
            }, {});
            console.log(group.peers);

            return group;
        }

        function refresh() {
            BunchAPI.groups.get($routeParams.groupId)
            .then(processGroup)
            .then(function(group) {
                $scope.state.group = group;
                $scope.state.loading = false;
                try {
                    $scope.$apply()
                } catch(error) {
                }
            });
        }
        refresh();

    })
    .service('DatetimeUtils', function() {
        return {
            humanizeTimeBetween: function(a, b, units) {
                units = units? units : ["mo", "d", "h"];
                var duration = (moment(b).unix() - moment(a).unix()) * 1000;
                return humanizeDuration(duration, { units:units, round:true });
            }
        };
    })
    .factory('TestGroup', function() {
        return function(groupId, groupName, logo, nextTimestamp) {
            console.log({groupId:groupId, groupName:groupName});
            var day   = Math.floor(Math.random() * 19) + 10 + 1;
            var month = Math.floor(Math.random() * 4);

            return {
                id: groupId
            ,   name: groupName
            ,   amountPerInterval: 10
            ,   payoutPerInterval: 50
            ,   nextTimestamp: (nextTimestamp? nextTimestamp : (new Date('2016-03-' + day))).toISOString()
            ,   vendor: {
                    id: 1
                ,   image: logo
                ,   name:  "Example Vendor"
                }
            ,   cashouts: [
                    {
                        id: 900
                    ,   peer: {
                            id: 4
                        ,   businessName: "Cathy's Shop"
                        ,   ownerName:    "Cathy"
                        ,   image: "/images/placeholder/3-square.jpg"
                        }
                    }
                ]
            ,   peers: [
                    {
                        id: 1
                    ,   businessName: "Lucy's Shop"
                    ,   ownerName:    "Lucy"
                    ,   image: "/images/placeholder/3-square.jpg"
                    },
                    {
                        id: 2
                    ,   businessName: "Amy's Shop"
                    ,   ownerName:    "Amy"
                    ,   image: "/images/placeholder/3-square.jpg"
                    },
                    {
                        id: 3
                    ,   businessName: "Lucas's Shop"
                    ,   ownerName:    "Lucas"
                    ,   image: "/images/placeholder/3-square.jpg"
                    },
                    {
                        id: 4
                    ,   businessName: "Cathy's Shop"
                    ,   ownerName:    "Cathy"
                    ,   image: "/images/placeholder/3-square.jpg"
                    },
                    {
                        id: 5
                    ,   businessName: "Nick's Shop"
                    ,   ownerName:    "Nick"
                    ,   image: "/images/placeholder/3-square.jpg"
                    }
                ]
            };
        };
    })
    .service('Utils', function() {
        return {
            copy: function(x) {
                return JSON.parse(JSON.stringify(x));
            }
        };
    })
    .service('BunchAPI', function($q, $http, Utils, TestGroup) {

        var groups = [
            [1, 'Farming Equipment', 'http://terrystractorrestoration.com/wp-content/uploads/2013/04/John-Deere-Logo.png'],
            [2, 'Aviation Parts',    'http://air.today/wp-content/uploads/2015/07/Boeing-logo-001-150x124.jpg'],
            [3, 'Fishing Boat Fund', 'http://www.nigeriajobs.pro/wp-content/themes/twentyfourteen/thumb-logo/piriou-group-jobs.png']
        ].map(function(pair) {
            var id   = pair[0];
            var name = pair[1];
            var logo = pair[2];
            return new TestGroup(id, name, logo);
        });

        return {
            vendors: {
                list: function() {
                    if (!TEST_MODE) {
                        return $http.get(API_HOST + "/vendors").then(function(result) {
                            return result.data;
                        });
                    }
                    return $q.when([
                        {
                          "id": 1,
                          "image": "/images/placeholder/1-square.jpg",
                          "name": "John Deere"
                        },
                        {
                          "id": 2,
                          "image": "/images/placeholder/1-square.jpg",
                          "name": "Dodge Ram"
                        }
                    ])
                }
            },
            users: {
                create: function(user) {
                },
                get: function(userId) {
                },
                list: function() {
                    if (!TEST_MODE) {
                        return $http.get(API_HOST + "/peers").then(function(result) {
                            return result.data.peer;
                        });
                    }
                    return $q.when([
                        {
                            id: 1
                        ,   businessName: "Lucy's Shop"
                        ,   ownerName:    "Lucy"
                        ,   email:        "lucy@example.com"
                        ,   image: "/images/placeholder/3-square.jpg"
                        },
                        {
                            id: 2
                        ,   businessName: "Amy's Shop"
                        ,   ownerName:    "Amy"
                        ,   email:        "amy@example.com"
                        ,   image: "/images/placeholder/3-square.jpg"
                        },
                        {
                            id: 3
                        ,   businessName: "Lucas's Shop"
                        ,   ownerName:    "Lucas"
                        ,   email:        "lucas@example.com"
                        ,   image: "/images/placeholder/3-square.jpg"
                        },
                        {
                            id: 4
                        ,   businessName: "Cathy's Shop"
                        ,   ownerName:    "Cathy"
                        ,   email:        "cathy@example.com"
                        ,   image: "/images/placeholder/3-square.jpg"
                        },
                        {
                            id: 5
                        ,   businessName: "Nick's Shop"
                        ,   ownerName:    "Nick"
                        ,   email:        "nick@example.com"
                        ,   image: "/images/placeholder/3-square.jpg"
                        }
                    ]);
                }
            },
            groups: {
                create: function(group) {
                    if (!TEST_MODE) {
                        return $http.post(API_HOST + "/groups", group).then(function(result) {
                            return result.data;
                        });
                    }
                    group.id = Math.floor(Math.random() * 100);
                    groups.push(group);
                    return $q.when();
                },
                get: function(groupId) {
                    if (!TEST_MODE) {
                        return $http.get(API_HOST + "/groups/" + groupId).then(function(result) {
                            return result.data;
                        });
                    }
                    var selected = null;
                    groups.forEach(function(group) {
                        if (group.id == groupId) {
                            selected = group;
                        }
                    });
                    return $q.when(selected? Utils.copy(selected) : null);
                },
                list: function() {
                    if (!TEST_MODE) {
                        return $http.get(API_HOST + "/groups").then(function(result) {
                            console.log(result.data.group);
                            return result.data.group;
                        });
                    }
                    return $q.when(Utils.copy(groups));
                }
            },
            runCycle: function() {
                if (!TEST_MODE) {
                    return $http.get(API_HOST + "/cycle");
                }
                return $q.when();
            }
        };
    });


angular
    .module('Services', [])
    .service('Sidebar', function()
    {
        var sidebarIsShown = false;

        function toggleSidebar()
        {
            sidebarIsShown = !sidebarIsShown;
        }

        return {
            isSidebarShown: function()
            {
                return sidebarIsShown;
            },
            toggleSidebar: toggleSidebar
        };
    });


