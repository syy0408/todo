angular.module('todo',[])
    .controller('todoCtrl',['$scope',function ($scope) {
        // 1.添加任务
        /*
         1.获取到用户输入的任务名字
         2.准备一个存储任务列表的数组
         3.监听用户的回车事件
         4.将用户输入的任务名字添加到任务列表中
         5.利用ng-repeat指令将任务列表展现到页面中
         */
        //准备一个任务列表
        $scope.taskList=[];
        
        //获取本地存储的数据
        function getTask() {
            if(localStorage.getItem('taskList')){
                $scope.taskList=angular.fromJson(localStorage.getItem('taskList'));
            }
        }
        getTask();
        $scope.addTask=function (event) {
            //判断用户是否回车并且输入内容不为空
            if(event.keyCode==13 && $scope.task){
                $scope.taskList.push({
                    name:$scope.task,
                    isCompleted:false,   //判断任务是否完成的状态
                    isEditing:false  //任务是否处于编辑状态
                });
                //清空输入框
                $scope.task='';

                //向本地存储数据
                localStorage.setItem('taskList',angular.toJson($scope.taskList));
            }
        };

        
        //2 删除任务
        /*
         1.给删除按钮添加点击事件
         2.将要删除的任务传递到事件处理函数中
         3.从数组中将数据删除
         */
        $scope.deleteTask=function (task) {
            $scope.taskList.splice($scope.taskList.indexOf(task),1);

        };


        //3 计算未完成任务的数量
        //当页面中数据有变化的时候 angularjs会重新渲染模板
        // filter 是数组下面的方法 对数据中的值进行过滤
        $scope.unCompletedNum=function () {
            return $scope.taskList.filter( item => !item.isCompleted ).length;
        };
        

        //4 数据过滤
        // 默认显示全部任务
        $scope.filterType='';
        $scope.selected='All'; //默认选中All按钮
        $scope.filterData=function (type) {
            switch (type){
                case 'All':
                    $scope.filterType='';
                    $scope.selected='All';
                    break;
                case 'Active':
                    $scope.filterType=false;
                    $scope.selected='Active';
                    break;
                case 'Completed':
                    $scope.filterType=true;
                    $scope.selected='Completed';
                    break;
            }
        }

        //5  清除已完成
            /*
             1.给清除已完成按钮添加点击事件
             2.找到完成的任务
             3.删除          
            * */
        $scope.clearCompletedTask=function () {
            $scope.taskList=$scope.taskList.filter(item => !item.isCompleted);
        };

        //6 批量更改任务状态
        $scope.changeStatus=function () {
            // 思路:当复选框的值为true 代表所有任务已完成 否则将所有任务更改为未完成状态 复选框绑定的值是status变量
            //alert($scope.status);
            $scope.taskList.forEach(item => item.isCompleted=$scope.status);
        };
        $scope.updateStatus=function () {
            // 思路：如果未完成任务的数量是0 开启高亮状态 否则取消高亮状态
            $scope.status=$scope.unCompletedNum()==0;
        };

        //7 修改任务名称
        /*
         1.给任务添加双击事件
         2.将当前任务更改为编辑状态 将其他任务取消编辑状态
         3.将数据和修改任务的文本框做绑定
         3.完成修改
         */
        $scope.editTask=function (task) {
            // 将全部任务的可编辑状态取消
            $scope.taskList.forEach(item => item.isEditing=false);
            // 将当前任务的可编辑状态开启
            $scope.taskList[$scope.taskList.indexOf(task)].isEditing=true;
        };
        //离开焦点事件--取消编辑状态
        $scope.cancelEdit=function () {
            $scope.taskList.forEach(item => item.isEditing=false);
        };

        //监听任务列表的变化，更改本地存储的数据
        // 这个地方的taskList 实际上是$scope.taskList
        // $watch第三个参数为true 叫做深度监听--监听数组
        $scope.$watch('taskList',function () {
            localStorage.setItem('taskList',angular.toJson($scope.taskList));
        },true)


    }])

    .directive('inpFocus',['$timeout',function ($timeout) {
        return {
            restrict:'A',
            link:function (scope,element,attributes) {
                //console.log(scope.item.isEditing);
                scope.$watch('item.isEditing',function (newValue) {
                    if(newValue){
                        $timeout(function () {
                            element[0].focus();
                        },0);
                    }
                })
            }
        }
    }])