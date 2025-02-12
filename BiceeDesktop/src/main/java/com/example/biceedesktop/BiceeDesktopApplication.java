package com.example.biceedesktop;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class BiceeDesktopApplication extends Application {

    public static void main(String[] args) {
        System.setProperty("java.awt.headless", "true");

        // Start Spring Boot in a separate thread
        new Thread(() -> SpringApplication.run(BiceeDesktopApplication.class, args)).start();

        // Launch JavaFX UI
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.initStyle(StageStyle.UNDECORATED); // Remove window decorations

        // Load the background image
        String imagePath = "C:\\Users\\omkar\\Desktop\\My-App\\BiceeDesktop\\src\\main\\resources\\welcomeimage\\image.png";
        Image image = new Image(new File(imagePath).toURI().toString());
        ImageView imageView = new ImageView(image);
        imageView.setFitWidth(800); // Reduced image width
        imageView.setFitHeight(600); // Reduced image height
        imageView.setPreserveRatio(false); // Ensure the image fills the space

        // Create a progress bar
        ProgressBar progressBar = new ProgressBar(0);
        progressBar.setPrefWidth(600); // Wider progress bar
        progressBar.setStyle("-fx-accent: #00FF00;"); // Customize progress bar color (optional)

        // Create a copyright label
        Label copyrightLabel = new Label("© 2025 Bicee Desktop. All rights reserved.");
        copyrightLabel.setFont(new Font("Arial", 14));
        copyrightLabel.setStyle("-fx-text-fill: white;"); // Set text color to white

        // Layout for the splash screen
        VBox vbox = new VBox(10, progressBar, copyrightLabel); // Progress bar and copyright at the top
        vbox.setAlignment(javafx.geometry.Pos.TOP_CENTER); // Align to the top center
        vbox.setStyle("-fx-background-color: rgba(0, 0, 0, 0.3); -fx-padding: 20;"); // Semi-transparent background (lighter overlay)

        StackPane root = new StackPane(imageView, vbox); // Stack image and VBox
        Scene scene = new Scene(root, 800, 600); // Reduced scene size
        primaryStage.setScene(scene);
        primaryStage.show();

        // Simulate application start progress
        new Thread(() -> {
            long startTime = System.currentTimeMillis();
            while (System.currentTimeMillis() - startTime < 11000) { // Loop for 11 seconds
                try {
                    Thread.sleep(100); // Update progress every 100 ms
                    final double progress = Math.min(1.0, (System.currentTimeMillis() - startTime) / 11000.0);
                    Platform.runLater(() -> progressBar.setProgress(progress));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            // After 11 seconds, open the browser
            Platform.runLater(() -> {
                openBrowser();
                primaryStage.close(); // Close the splash screen
            });
        }).start();
    }

    private void openBrowser() {
        try {
            String url = "http://localhost:8080";
            if (System.getProperty("os.name").toLowerCase().contains("win")) {
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
            } else if (System.getProperty("os.name").toLowerCase().contains("mac")) {
                Runtime.getRuntime().exec("open " + url);
            } else {
                Runtime.getRuntime().exec("xdg-open " + url);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
