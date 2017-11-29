// --------------------------------------------------------------------
var employees = [
{
name: 'Angela Walker',
availability: [{
    day:'Monday',
    time: '10.00-12.00'
    },
    {
    day: 'Wednesday',
    time: '13.00-15.30'
    }]    
},
{
    name: 'Lia Shelton',
    availability: [{
        day:'Tuesday',
        time: '10.00-12.00'
        },
        {
        day: 'Wednesday',
        time: '13.00-15.30'
        },
        {
            day:'Friday',
            time:'14.00-16.00'
        }]     
}
]

var candidates = [
    {    
    name: 'Anna Bass',
    managers:['Angela Walker']
        
    },
    {
    name: 'Darrell Gill',
    managers: ['Angela Walker', 'Lia Shelton']         
    }
];
// .......................................................................
//Postman
// POST employee
// {
// 	"name": "Lia Shelton"
// }

// POST candidates
// {	
// 	"name": "Darrell Gill",
//     "managers": "['Angela Walker', 'Lia Shelton']"
// }
// POST availability
// {
// 	"employeeId": "2",
// 	"day": "Wednesday",
// 	"time": "13.00-15.30"
	
// }    