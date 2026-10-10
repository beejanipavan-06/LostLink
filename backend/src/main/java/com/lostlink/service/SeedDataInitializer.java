package com.lostlink.service;

import com.lostlink.dto.ItemCreateRequest;
import com.lostlink.dto.ItemDTO;
import com.lostlink.entity.ItemType;
import com.lostlink.entity.Role;
import com.lostlink.entity.User;
import com.lostlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SeedDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MongoSyncService mongoSyncService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmail("student1@anurag.edu.in")) {
            return; // Already seeded with @anurag.edu.in users
        }

        // 1. Create Default Users (Anurag University)
        User studentA = new User("Alex Rivers", "student1@anurag.edu.in", "24EG1001", passwordEncoder.encode("password"), Role.STUDENT);
        studentA.setRecoveryScore(65);
        userRepository.save(studentA);
        mongoSyncService.saveUserToMongo(studentA);

        User studentB = new User("Sam Taylor", "student2@anurag.edu.in", "24EG1002", passwordEncoder.encode("password"), Role.STUDENT);
        studentB.setRecoveryScore(80);
        userRepository.save(studentB);
        mongoSyncService.saveUserToMongo(studentB);

        User studentC = new User("Moukthika T", "24eg106c47@anurag.edu.in", "24EG106C47", passwordEncoder.encode("password"), Role.STUDENT);
        studentC.setRecoveryScore(95);
        userRepository.save(studentC);
        mongoSyncService.saveUserToMongo(studentC);

        User admin = new User("Anurag Campus Admin", "admin@anurag.edu.in", "ADM9999", passwordEncoder.encode("admin123"), Role.ADMIN);
        admin.setRecoveryScore(100);
        userRepository.save(admin);
        mongoSyncService.saveUserToMongo(admin);

        // 2. Demo Scenario Items
        // Student A reports Lost Backpack
        ItemCreateRequest lostBackpack = new ItemCreateRequest();
        lostBackpack.setTitle("Black Backpack");
        lostBackpack.setCategory("Bags");
        lostBackpack.setType(ItemType.LOST);
        lostBackpack.setLocation("Library");
        lostBackpack.setDateReported(LocalDate.now().minusDays(2));
        lostBackpack.setColor("Black");
        lostBackpack.setBrand("North Face");
        lostBackpack.setDescription("Black North Face laptop backpack left on 2nd floor reading area.");
        lostBackpack.setPublicDetails("Attached blue keychain on side zipper.");
        lostBackpack.setImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80");
        ItemDTO lostItemDTO = itemService.createItem(studentA.getId(), lostBackpack);

        // Student B reports Found Backpack
        ItemCreateRequest foundBackpack = new ItemCreateRequest();
        foundBackpack.setTitle("Black Backpack");
        foundBackpack.setCategory("Bags");
        foundBackpack.setType(ItemType.FOUND);
        foundBackpack.setLocation("Library");
        foundBackpack.setDateReported(LocalDate.now().minusDays(1));
        foundBackpack.setColor("Black");
        foundBackpack.setBrand("North Face");
        foundBackpack.setDescription("Black backpack found under desk near silent study section in Library.");
        foundBackpack.setPublicDetails("Clean black backpack with padded shoulder straps.");
        foundBackpack.setPrivateDetails("Small Star Wars sticker inside front pocket, blue keychain attached, broken zipper on left pocket.");
        foundBackpack.setImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80");
        ItemDTO foundItemDTO = itemService.createItem(studentB.getId(), foundBackpack);

        // Additional Demo Items
        ItemCreateRequest idCard = new ItemCreateRequest();
        idCard.setTitle("Blue Student ID Card");
        idCard.setCategory("Documents / ID");
        idCard.setType(ItemType.FOUND);
        idCard.setLocation("Canteen");
        idCard.setDateReported(LocalDate.now().minusDays(3));
        idCard.setColor("Blue");
        idCard.setBrand("Campus ID");
        idCard.setDescription("Student ID card found near billing counter in Main Canteen.");
        idCard.setPublicDetails("Campus CS Department Student ID Card.");
        idCard.setPrivateDetails("ID ending in 4829, lanyards marked with Computer Science emblem.");
        idCard.setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80");
        itemService.createItem(studentB.getId(), idCard);

        ItemCreateRequest wallet = new ItemCreateRequest();
        wallet.setTitle("Brown Leather Wallet");
        wallet.setCategory("Accessories");
        wallet.setType(ItemType.LOST);
        wallet.setLocation("Main Block");
        wallet.setDateReported(LocalDate.now().minusDays(4));
        wallet.setColor("Brown");
        wallet.setBrand("Fossil");
        wallet.setDescription("Bifold brown leather wallet lost near Main Auditorium entrance.");
        wallet.setPublicDetails("Brown genuine leather bifold wallet.");
        wallet.setImageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80");
        itemService.createItem(studentA.getId(), wallet);

        ItemCreateRequest earbuds = new ItemCreateRequest();
        earbuds.setTitle("Black Earbuds Case");
        earbuds.setCategory("Electronics");
        earbuds.setType(ItemType.FOUND);
        earbuds.setLocation("Labs");
        earbuds.setDateReported(LocalDate.now().minusDays(1));
        earbuds.setColor("Black");
        earbuds.setBrand("Sony");
        earbuds.setDescription("Wireless earbuds charging case found in Computer Lab 3.");
        earbuds.setPublicDetails("Black matte finish charging case.");
        earbuds.setPrivateDetails("Left earbud missing inside, small scratch near USB-C port.");
        earbuds.setImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80");
        itemService.createItem(studentB.getId(), earbuds);

        System.out.println(">>> LostLink Anurag Seed Data Initialized Successfully! Demo users: student1@anurag.edu.in / password, 24eg106c47@anurag.edu.in / password, admin@anurag.edu.in / admin123");
    }
}
