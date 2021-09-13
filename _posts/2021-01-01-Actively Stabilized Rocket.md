---
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: true
      comments: true
      share: true
      related: true
---

### Introduction

If you have ever shot a model rocket you might have seen the rocket spinning when shooting up. This spin happen in the roll axis which can have its advantages and disadvantages. One of the advantages is that spinning object will behave like a Gyroscope and will resist any rotation yaw and pitch rotation[Cite]. The primary advantage of This project was an attempt to reduce the roll by actively correcting for it. The benefits of this is that the rocket will have known orientation which will make it easier to direct the rocket. The rocket is stabilized by 3 fins connect to servo motors. For this project, Micro servo motors will be used since they have sufficient torque and are light.


<script type="module" src= "../assets/js/ASRcode.js"></script>

<!--
<div class ="page__content">
<canvas id="c"></canvas>
<span id="rock" class="diagram left"></span>
</div>
-->
<body>
<div id="rocket" class="diagram">
    <canvas id = "c">
    </canvas>
</div>
</body>


{% capture rocket_img %}
![Foo]({{ "/assets/images/Rocket.jpg" | relative_url }})
{% endcapture %}

<figure>
  {{ rocket_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption> Model Rocket  on launch day.</figcaption>
</figure>

### Material and Equipment

#### 1.  Arduino Nano
 The Arduino Nano is a small microcontroller which will make it easier to fit into the rocket. The Nano will have sufficient speed to control the servo motors, get data, and process control.
#### 2.  Micro Servo motors(sg51r)
 While this servo doesn't have a lot of power, it should be sufficient to apply a corrective force to the rocket.
#### 3.  Model Rocket(Dragonite Model Rocket)
 This model rocket can be cheap but make sure it has enough space for the rocket components.
#### 4.  3D printer
 We will need to print out  housing for the servo motors and parachute.
#### 5. Lithium Ion Battery Pack
 Servo motors require a good amount of power which can be supplied by Lithium Ion battery. Lithium Ion batteries have a voltage around 3.7 voltage and with a low internal resistance. This mean a larger amount of energy can be extracted in shorter time,
#### 6. Boot converter
 The servo have a operating voltage at 4.8V. The boost converter will raise the voltage of the Lithium Ion Battery to 4.8 volts.
#### 7. MPU6050
 This is a nice 3-axis accelerometer, gyroscope, and IMU which will be used gather data on the roll of the rocket. The Gyro will retrieve the rotation speed of our rocket which be used as feed back.

### Software

#### 1. Blender
Blender is a general 3D computer graphics software which is used to create models and much more. The software is not really designed for CAD which is why it should be used. Blender was the easier tool for me to use but I would not recommend this for CAD.
#### 2. Cura
Once we have modeled our part how do send the model to the printer. Cura works with a verity of 3D printers and you can customize the parameter of the 3d printer.

#### 3. Arduino IDE
When we are done writing the software we will need to upload to the Arduino. The Arduino IDE will help manage libraries for the MPU605, Micro Servos and PID libraries.


#### Process


#### Code

```c++
// Code does not work properly and has a major issue
float fixerror(double acceleration)
{
	if (acceleration < NOISEMPU && acceleration > -NOISEMPU){

		accellPID.Compute(acceleration);

	}else{
		accellPID.Compute(0.0);
	}
	// error acceleration will be save in U1.
	return U1;
}

```
This will stop the roll acceleration of the rocket but will not stop the roll velocity. This means the rocket roll will  not accelerate or decelerate since we are trying to keep a zero. We can fix this by using the PID controller to set the roll velocity by zero.

```c++
// Code is better since we will stop the velocity of the roll.
float fixerror(double acceleration, double velocity )
{

	if(velocity < NOISEVEL && velocity > -NOISEVEL){
		velPID.Compute(velocity);
	}else{
		velPID.Compute(0);
	}
	// error velocity correction will be save in U2. // error acceleration will be save in U1.
	return u2;
}
```
The issue with this code is that acceleration will not be counteracted directly but indirectly. We must first wait until the acceleration has accumulated before we try and correct it.
### Conclusion

While this project is interesting this method of controlling the roll is not really effective. The weight of all the components  make this project not worth the effort. If I would do another project I would work on thrust vectoring rather than servo motors.
