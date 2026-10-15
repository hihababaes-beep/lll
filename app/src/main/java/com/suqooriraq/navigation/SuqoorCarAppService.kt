package com.suqooriraq.navigation

import android.content.Intent
import android.net.Uri
import androidx.car.app.CarAppService
import androidx.car.app.Session
import androidx.car.app.Screen
import androidx.car.app.validation.HostValidator
import androidx.car.app.model.Action
import androidx.car.app.model.CarColor
import androidx.car.app.model.CarIcon
import androidx.car.app.model.ItemList
import androidx.car.app.model.ListTemplate
import androidx.car.app.model.Row
import androidx.car.app.model.Template
import androidx.car.app.model.Header
import androidx.car.app.model.CarText
import androidx.car.app.model.ActionStrip
import androidx.car.app.model.CarAppApiLevels
import androidx.car.app.CarContext
import androidx.car.app.model.Action.APP_ICON

/**
 * Android Auto companion screen.
 *
 * It is intentionally a low-distraction destination picker, not a custom full-screen map.
 * Choosing a destination hands off to Google Maps for turn-by-turn guidance.
 */
class SuqoorCarAppService : CarAppService() {
    override fun createHostValidator(): HostValidator =
        HostValidator.ALLOW_ALL_HOSTS_VALIDATOR // Replace with production allow-list before release.

    override fun onCreateSession(): Session = SuqoorSession()
}

class SuqoorSession : Session() {
    override fun onCreateScreen(intent: Intent): Screen = DestinationScreen(carContext)
}

private data class Destination(val title: String, val query: String, val subtitle: String)

class DestinationScreen(carContext: CarContext) : Screen(carContext) {
    private val destinations = listOf(
        Destination("بغداد", "Baghdad, Iraq", "العاصمة العراقية"),
        Destination("النجف", "Najaf, Iraq", "النجف الأشرف"),
        Destination("كربلاء", "Karbala, Iraq", "كربلاء المقدسة"),
        Destination("البصرة", "Basra, Iraq", "محافظة البصرة"),
        Destination("الموصل", "Mosul, Iraq", "محافظة نينوى"),
        Destination("أربيل", "Erbil, Iraq", "إقليم كردستان")
    )

    override fun onGetTemplate(): Template {
        val items = ItemList.Builder()
        destinations.forEach { destination ->
            items.addItem(
                Row.Builder()
                    .setTitle(CarText.create(destination.title))
                    .addText(CarText.create(destination.subtitle))
                    .setBrowsable(false)
                    .setOnClickListener { launchNavigation(destination.query) }
                    .build()
            )
        }

        return ListTemplate.Builder()
            .setSingleList(items.build())
            .setTitle("خريطة صقور العراق")
            .setHeaderAction(Action.APP_ICON)
            .setActionStrip(
                ActionStrip.Builder()
                    .addAction(
                        Action.Builder()
                            .setTitle("فتح الخريطة")
                            .setOnClickListener {
                                val launch = carContext.packageManager
                                    .getLaunchIntentForPackage(carContext.packageName)
                                if (launch != null) carContext.startActivity(launch)
                            }
                            .build()
                    )
                    .build()
            )
            .build()
    }

    private fun launchNavigation(query: String) {
        // Android Auto interaction hands route guidance to the installed navigation provider.
        val googleNav = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("google.navigation:q=" + Uri.encode(query))
        ).setPackage("com.google.android.apps.maps").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        try {
            carContext.startActivity(googleNav)
        } catch (_: Exception) {
            val webMaps = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("https://www.google.com/maps/dir/?api=1&destination=" + Uri.encode(query))
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            carContext.startActivity(webMaps)
        }
    }
}
