import themidibus.*;
MidiBus myBus;

/*

Karl Yerkes
2023-10-13

Use this Processing sketch and the accompanying Max patch
(see compressed patch below) to update your Korg Monotron
Delay replica so that it receives midi control. Improve
this Processing sketch so it plays a simple piece of music,
a familar melody or a composition of your own.

*/

void setup() {
  size(400, 400);
  background(0);
  myBus = new MidiBus(this, -1, "to Max 1");
}

void draw() {
  //myBus.sendNoteOn(channel, pitch, velocity); // Send a Midi noteOn
  //myBus.sendControllerChange(channel, 90, frameCount % 128); // Send a controllerChange
  playSong(song);
  //delay(200);
  //myBus.sendNoteOff(channel, pitch, velocity); // Send a Midi nodeOff
}

int[][] song = {
  {67, 500}, 
  {67, 250}, 
  {69, 250}, 
  {71, 500}, 
  {72, 250}, 
  {72, 250}, 
  {71, 250}, 
  {69, 250}, 
  // ... Continue in this format for the rest of the sheet music
};

void playSong(int[][] song) {
  for (int i = 0; i < song.length; i++) {
    int pitch = song[i][0];
    int duration = song[i][1];
    myBus.sendNoteOn(0, pitch, 127);
    delay(duration);
    myBus.sendNoteOff(0, pitch, 127);
  }
}

void delay(int time) {
  int current = millis();
  while (millis () < current+time) Thread.yield();
}

/*

<pre><code>
----------begin_max5_patcher----------
876.3ocwXszbZCCD9L7qPiOSYjeA3dtW5zIyzK8TSmLJ1BhRjk7HISflI42d
WKYGHASw3XZmIAauHse629Rq4owi7tUtgp8PeF8SznQOMdzHqnJAipedjWNY
SJmnsKyKUlmSEFuItuyP2Xrx+glhL2wznBhI8NDQjAORQjTXCEDwVlXE56JY
JUqqtU+.sZYFIprHiXnnsxRE5aR0JzURgznjBzWnbxVjhVvYoDjVBJjXPLCH
JkxVS0nbVFCkJEvx4SQeMuPIWWqpCwBT.r2BPmZDnNVdAmhJXftPxkn7RMKc
B7EKI4LNQgxobY1VjTAxp3fTyLLvpf0ZAP9nXZiWfyDzTYov5JhqEJJyYBN0
X8a90BsdGvntA3fw42ihmMEOAEmT8YX.t5x7noXzu1oHYooQS3ZorLqeWd68
eJHvqR1yiGW8wjNFIEzGgMePfL2HW5clTX9hJiNvO1QA6CAGkAMJxIxrsf5z
hm2qaXOx4Oe.IGWpn5WP3oveyakkgGmkwXG8laiPw8kkZ1JAg2NWm0GtR+cF
I8kVYSvwYSPrMNEEFZuD27Y2S67i6i0thvDubtIXAtLrvEVa1OH7DN+FdmWx
Mrz6HBAkulnXDWIJ9DwlIGKWLx6UaTQxoFp5FpfbK2te7+2hvfZuRT3knJze
.qBKEEjzGbUg8kk3jl9jcJQ3.VtjKIlp.s6lV4Ld.4rl734WhVyUWulv4WfN
NI8gh4vAqjUzC3nOFJMmetrzOx2VT6Zu1+9psxuEC4IivzFLA5ZOXpkqHaP9
W60yrW2Y8IK5KUYh1yXmMvrE5xoo8ji9XasYRvz3+JIWbz34jc+WQ3cW1+11
bCwCaRczYmQii2yC3xqGrL5nALFmZ3uKgFkf62vetT5ZJ2mFx6EhasY79z1t
.6T2u6cWrlWk725Kzv.6oM.UOn0DzNSLipMLAoZ998WTjaQs5u6JRIcAnYC.
PvbxcDI+OJRcAn2ZMRUFUYyi9XHG0Enicb78Pi+GA8vy5t3vSFhTH7a7bWvp
BKRmza5O.HE2EfvsG1vWbjWzdp5GKeoK81hGhfXGvI5z0htl4jhh0Tktd2VL
givtWpdcFAXhDg6Q6uvhmhtl0r9YVIDEb1jANXpTYsSuMybmc6kKAfEkrZmK
vV.R6wiB303zvqi31P0onied7efHfsGR
-----------end_max5_patcher-----------
</code></pre>

*/
