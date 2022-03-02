function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile()
    console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName())
    console.log('Image URL: ' + profile.getImageUrl())
    console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
    //alert("ID: "+profile.getId()+"\nName: "+profile.getName()+"\nImage URL:"+profile.getImageUrl()+"\nEmail: "+profile.getEmail())
    $("#profile").attr("src", profile.getImageUrl())
    $("#name").text(profile.getName())
    $("#email").text(profile.getEmail())
    $(".g-signin2").fadeOut()
    $("#content").fadeIn()
    window.location = "./editor"
}
function force(){
    signOut()
    var client = gapi.auth2.init({client_id: '416030417638-urh4nlr608etmssd75f9qterub8d7apg.apps.googleusercontent.com', scope: 'profile https://www.googleapis.com/auth/drive.file'})
    client.signIn().then(() => {
        var profile = client.currentUser.get().getBasicProfile()
        //alert("ID: "+profile.getId()+"\nName: "+profile.getName()+"\nImage URL:"+profile.getImageUrl()+"\nEmail: "+profile.getEmail())
    })
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(() =>{
        $("#content").fadeOut()
        $(".g-signin2").fadeIn()
        console.log('User signed out.')
        alert("User signed out.")
    })
}