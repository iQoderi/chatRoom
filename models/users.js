/**
 *
 * Created by qoder on 16-2-25.
 */
var mongoose=require('mongoose');

var schema=mongoose.Schema;

var users=new schema({
    username:String,
    usersay:Array
});

mongoose.model('Users',users);

