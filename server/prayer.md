ok this is the explation how we created the prayer bot
we used the open sources APi called al adhan
this is platform with open sources api that share prayer time with specific dates and caliculated times
the developer gave the data with the object like
[
data:{
...
}
]
so after the const response = await axios.get(url
we used data =reponse.data.data
the first data is from axios to fetched data so it must be used but the second data is the al-adhan api form that ypu have to write the data blc all the info are in the data:{....}
then we return the data to other function to be used in

       2:

we used the telegraf package to use bot writing functions and connection bln the telegram and the node codes
and we got the bot token from the bot father then we used the telegraf package to commucate and launch bot

we used the bot.start methods to give a wellcome message when the user click the start btn

B: we created the menu lists using the
bot.telegrap.setcommands
then we used the bot.command("prayer). to make the menu work and costumize it

2: then we started the bot ability to accept the user input useing
bot.on("text",(ctx)=> {
then we get the user input
const city=ctx.message.text.tolowercase.trim
then send the city name to the function that use the city name to access the api and get the city info so
const getCityInfo=cityFunction(city)

     then get the api data using the
     getCityInfo.timings,
     getCityInfo.meta
      an other
       the like prayer time is like
        getCityInfo.timings.Dhur

})

### location methid

bot.command("location",
make the bot to lisen for specifc command which is called location
then the ctx or the context of the user info
then create a btn and dispears


