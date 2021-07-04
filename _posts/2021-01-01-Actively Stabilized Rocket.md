---
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: true
      read_time: true
      comments: true
      share: true
      related: true
---

# Introduction

This project was an attempt to reduce the roll by actively correcting for it. The benefits of this is that the rocket will have known orientation which will make it easier to direct the rocket. The rocket is stabilized by 3 fins connect to servo motors. For this project, Micro servo motors will be used since they have sufficient torque and are light.

{% capture rocket_img %}
![Foo]({{ "/assets/images/Rocket.jpg" | relative_url }})
{% endcapture %}

<figure>
  {{ rocket_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption> Model rocket with fins.</figcaption>
</figure>


# Material and Equipment

1.  Arduino Nano
* The Arduino Nano is a small microcontroller which will make it easier to fit into the rocket. The Nano will have sufficient speed to control the servo motors, get data, and process control.
2.  Micro Servo motors
* While this servo doesn't have a lot of power, it should be sufficient to apply a corrective force to the rocket.
3.  Model Rocket
* This model rocket can be cheap but make sure it has enough space for the rocket components.
4.  3D printer
* We will need to print out  housing for the 3D printer and parachute section.
5. Lithium Ion Battery Pack
* Servo motors require a good amount of power these Lithium Ion battery will be able to supply.
6. Boot Convertor
* Lithium Ion batteries have a voltage around 3.7 voltage and with a low internal resistance. This mean more power can be draw quickly which will all us to power the 3 servo motors.
7. MPU6050
* This is a nice accelerometer, Gyro, and IMU which will be used gather data on the roll of the rocket. The Gyro will retrieve the rotation speed of our rocket which be used as feed back.

# Steps

# Conclusion
