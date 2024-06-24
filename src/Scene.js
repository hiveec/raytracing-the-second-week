import {
    Camera, Point, Color, Ray, Vec3, util, Renderer,
    Sphere, Quad, createBox, HittableList, BvhNode,
    Lambertian, Metal, Dielectric,
    NoiseTexture, CheckerTexture, ImageTexture, DiffuseLight, ConstantMedium, RotateY, Translate
} from './index'

export class Scene {
    static async final_scene(width, height) {
        let boxes1 = new HittableList();
        let ground = new Lambertian(new Color(0.48, 0.83, 0.53));

        let boxes_per_side = 20;
        for (let i = 0; i < boxes_per_side; i++) {
            for (let j = 0; j < boxes_per_side; j++) {
                let w = 100.0;
                let x0 = -1000.0 + i * w;
                let z0 = -1000.0 + j * w;
                let y0 = 0.0;
                let x1 = x0 + w;
                let y1 = random_double(1, 101);
                let z1 = z0 + w;

                boxes1.add(createBox(new Point(x0, y0, z0), new Point(x1, y1, z1), ground));
            }
        }

        let world = new HittableList();;

        world.add(new BvhNode(boxes1));

        let light = new DiffuseLight(new Color(7, 7, 7));
        world.add(new Quad(new Point(123, 554, 147), new Vec3(300, 0, 0), new Vec3(0, 0, 265), light));

        let center1 = new Point(400, 400, 200);
        let center2 = center1.add(new Vec3(30, 0, 0));
        let sphere_material = new Lambertian(new Color(0.7, 0.3, 0.1));
        world.add(new Sphere(center1, center2, 50, sphere_material));

        world.add(new Sphere(new Point(260, 150, 45), 50, new Dielectric(1.5)));
        world.add(new Sphere(
            new Point(0, 150, 145), 50, new Metal(new Color(0.8, 0.8, 0.9), 1.0)
        ));

        let boundary = new Sphere(new Point(360, 150, 145), 70, new Dielectric(1.5));
        world.add(boundary);
        world.add(new ConstantMedium(boundary, 0.2, new Color(0.2, 0.4, 0.9)));
        boundary = new Sphere(new Point(0, 0, 0), 5000, new Dielectric(1.5));
        world.add(new ConstantMedium(boundary, 0.0001, new Color(1, 1, 1)));

        let emat = new Lambertian(new ImageTexture("earthmap.jpg"));
        await emat.load();
        world.add(new Sphere(new Point(400, 200, 400), 100, emat));
        let pertext = new NoiseTexture(0.2);
        world.add(new Sphere(new Point(220, 280, 300), 80, new Lambertian(pertext)));

        let boxes2 = new HittableList();;
        let white = new Lambertian(new Color(.73, .73, .73));
        let ns = 1000;
        for (let j = 0; j < ns; j++) {
            boxes2.add(new Sphere(Point.rand(0, 165), 10, white));
        }

        world.add(new BvhNode(boxes2));

        let camera = new Camera(width, height, 40)
        camera.lookAt(new Point(478, 278, -600), new Point(278, 278, 0));

        // 800, 10000
        let renderer = new Renderer({
            maxDepth: 50,
            samplesPerPixel: 200,
            background: new Color(0, 0, 0)  //clear background
        })
        let imageData = renderer.render(camera, world)
        return imageData;

    }

    static cornell_smoke(width, height) {
        let world = new HittableList();

        let red = new Lambertian(new Color(.65, .05, .05));
        let white = new Lambertian(new Color(.73, .73, .73));
        let green = new Lambertian(new Color(.12, .45, .15));
        let light = new DiffuseLight(new Color(7, 7, 7));

        world.add(new Quad(new Point(555, 0, 0), new Vec3(0, 555, 0), new Vec3(0, 0, 555), green));
        world.add(new Quad(new Point(0, 0, 0), new Vec3(0, 555, 0), new Vec3(0, 0, 555), red));
        world.add(new Quad(new Point(113, 554, 127), new Vec3(330, 0, 0), new Vec3(0, 0, 305), light));
        world.add(new Quad(new Point(0, 555, 0), new Vec3(555, 0, 0), new Vec3(0, 0, 555), white));
        world.add(new Quad(new Point(0, 0, 0), new Vec3(555, 0, 0), new Vec3(0, 0, 555), white));
        world.add(new Quad(new Point(0, 0, 555), new Vec3(555, 0, 0), new Vec3(0, 555, 0), white));

        // let box1 = createBox(new Point(0, 0, 0), new Point(165, 330, 165), white);
        // box1 = new RotateY(box1, 15);
        // box1 = new Translate(box1, new Vec3(265, 0, 295));
        // world.add(box1);

        // let box2 = createBox(new Point(0, 0, 0), new Point(165, 165, 165), white);
        // box2 = new RotateY(box2, -18);
        // box2 = new Translate(box2, new Vec3(130, 0, 65));
        // world.add(box2);

        let box1 = createBox(new Point(265, 0, 295), new Point(430, 330, 460), white);
        let box2 = createBox(new Point(130, 0, 65), new Point(295, 165, 230), white);

        world.add(new ConstantMedium(box1, 0.01, new Color(0, 0, 0)));
        world.add(new ConstantMedium(box2, 0.01, new Color(1, 1, 1)));

        let camera = new Camera(width, height, 40)
        camera.lookAt(new Point(278, 278, -800), new Point(278, 278, 0));

        let renderer = new Renderer({
            maxDepth: 50,
            samplesPerPixel: 200,
            background: new Color(0, 0, 0)  //clear background
        })
        let imageData = renderer.render(camera, world)
        return imageData;
    }

    static cornell_box(width, height) {

        let world = new HittableList();

        let red = new Lambertian(new Color(.65, .05, .05));
        let white = new Lambertian(new Color(.73, .73, .73));
        let green = new Lambertian(new Color(.12, .45, .15));
        let light = new DiffuseLight(new Color(15, 15, 15));

        // world.add(new Quad(new Point(555, 0, 0), new Vec3(0, 555, 0), new Vec3(0, 0, 555), green));
        // world.add(new Quad(new Point(0, 0, 0), new Vec3(0, 555, 0), new Vec3(0, 0, 555), red));
        // world.add(new Quad(new Point(0, 0, 0), new Vec3(555, 0, 0), new Vec3(0, 0, 555), white));
        // world.add(new Quad(new Point(555, 555, 555), new Vec3(-555, 0, 0), new Vec3(0, 0, -555), white));
        // world.add(new Quad(new Point(0, 0, 555), new Vec3(555, 0, 0), new Vec3(0, 555, 0), white));

        world.add(new Quad(new Point(343, 554, 332), new Vec3(-130, 0, 0), new Vec3(0, 0, -105), light));

        let box1 = createBox(new Point(0, 0, 0), new Point(165, 330, 165), white);
        box1 = new RotateY(box1, 15);
        box1 = new Translate(box1, new Vec3(265, 0, 295));

        let box2 = createBox(new Point(0, 0, 0), new Point(165, 165, 165), white);
        box2 = new RotateY(box2, -18);
        box2 = new Translate(box2, new Vec3(130, 0, 65));

        // let box1 = createBox(new Point(265, 0, 295), new Point(430, 330, 460), white);
        // let box2 = createBox(new Point(130, 0, 65), new Point(295, 165, 230), white);
        world.add(box2);
        world.add(box1);

        let camera = new Camera(width, height, 40)
        camera.lookAt(new Point(278, 278, -800), new Point(278, 278, 0));

        let renderer = new Renderer({
            maxDepth: 50,
            samplesPerPixel: 200,
            background: new Color(0, 0, 0)  //clear background
        })
        let imageData = renderer.render(camera, world)
        return imageData;
    }

    static simple_light(width, height) {
        let world = new HittableList();
        let pertext = new NoiseTexture(4);
        world.add(new Sphere(new Point(0, -1000, 0), 1000, new Lambertian(pertext)));
        world.add(new Sphere(new Point(0, 2, 0), 2, new Lambertian(pertext)));

        let difflight = new DiffuseLight(new Color(4, 4, 4));
        world.add(new Quad(new Point(3, 1, -2), new Vec3(2, 0, 0), new Vec3(0, 2, 0), difflight));
        world.add(new Sphere(new Point(0, 7, 0), 2, difflight));

        let camera = new Camera(width, height, 20)
        camera.lookAt(new Point(26, 3, 6), new Point(0, 2, 0))

        let renderer = new Renderer({
            maxDepth: 50,
            samplesPerPixel: 20,
            background: new Color(0, 0, 0)  //clear background
        })
        let imageData = renderer.render(camera, world)
        return imageData;

    }

    static perlin_sphere(width, height) {
        let world = new HittableList();
        let pertext = new NoiseTexture(4);
        world.add(new Sphere(new Point(0, -1000, 0), 1000, new Lambertian(pertext)));
        world.add(new Sphere(new Point(0, 2, 0), 2, new Lambertian(pertext)));

        let renderer = new Renderer({ maxDepth: 50, samplesPerPixel: 20 })
        let camera = new Camera(width, height, 20)
        camera.lookAt(new Point(13, 2, 3), new Point(0, 0, 0))
        let imageData = renderer.render(camera, world)
        return imageData;
    }

    static quads(width, height) {

        let world = new HittableList();
        // Materials
        let left_red = new Lambertian(new Color(1.0, 0.2, 0.2));
        let back_green = new Lambertian(new Color(0.2, 1.0, 0.2));
        let right_blue = new Lambertian(new Color(0.2, 0.2, 1.0));
        let upper_orange = new Lambertian(new Color(1.0, 0.5, 0.0));
        let lower_teal = new Lambertian(new Color(0.2, 0.8, 0.8));

        // Quads
        world.add(new Quad(new Point(-3, -2, 5), new Vec3(0, 0, -4), new Vec3(0, 4, 0), left_red));
        world.add(new Quad(new Point(-2, -2, 0), new Vec3(4, 0, 0), new Vec3(0, 4, 0), back_green));
        world.add(new Quad(new Point(3, -2, 5), new Vec3(0, 0, -4), new Vec3(0, 4, 0), right_blue));
        world.add(new Quad(new Point(-2, 3, 1), new Vec3(4, 0, 0), new Vec3(0, 0, 4), upper_orange));
        world.add(new Quad(new Point(-2, -3, 5), new Vec3(4, 0, 0), new Vec3(0, 0, -4), lower_teal));

        let renderer = new Renderer({ maxDepth: 50, samplesPerPixel: 20 })
        let camera = new Camera(width, height, 80)
        camera.lookAt(new Point(0, 0, 9), new Point(0, 0, 0))
        let imageData = renderer.render(camera, world)
        return imageData;
    }


    static async earth_texture(width, height) {
        let earth_texture = new ImageTexture("./assets/earthmap.jpg");
        await earth_texture.load()  //image parse

        let earth_surface = new Lambertian(earth_texture);
        let globe = new Sphere(new Point(0, 0, 0), 2, earth_surface);

        let world = new HittableList();
        world.add(globe)

        let renderer = new Renderer({ maxDepth: 50, samplesPerPixel: 20 })
        let camera = new Camera(width, height, 60, 10)
        camera.lookAt(new Point(0, 0, 12), new Point(0, 0, 0))
        camera.samplesPerPixel = 20;
        let imageData = renderer.render(camera, world)
        return imageData;
    }

    //groud with CheckerTexture
    static checkered_spheres(width, height) {

        let world = new HittableList();
        let ground_material = new Lambertian(new CheckerTexture(0.32, new Color(.2, .3, .1), new Color(.9, .9, .9)));
        world.add(new Sphere(new Point(0, -1000, 0), 1000, ground_material));
        let material1 = new Dielectric(1.5);
        world.add(new Sphere(new Point(0, 1, 0), 1.0, material1));
        let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
        world.add(new Sphere(new Point(-2, 1, 0), 1.0, material2));
        let material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
        world.add(new Sphere(new Point(2, 1, 0), 1.0, material3));

        let renderer = new Renderer({ maxDepth: 50, samplesPerPixel: 20 })
        let camera = new Camera(width, height, 20, 10)
        camera.lookAt(new Point(0, 2, 13), new Point(0, 0, 0))
        camera.samplesPerPixel = 20;
        let imageData = renderer.render(camera, world)
        return imageData;
    }

    static bvh(width, height) {

        let renderer = new Renderer({ maxDepth: 50, samplesPerPixel: 20 })

        let camera = new Camera(width, height, 20, 10)
        camera.lookAt(new Point(0, 2, 13), new Point(0, 0, 0))
        camera.samplesPerPixel = 20;

        let world = new HittableList();
        //groud
        let ground_material = new Lambertian(new Color(0.5, 0.5, 0.5));
        world.add(new Sphere(new Point(0, -1000, 0), 1000, ground_material));

        let objects = [];
        const maxCount = 5;

        for (let a = -maxCount; a < maxCount; a++) {
            for (let b = -maxCount; b < maxCount; b++) {
                let choose_mat = util.rand();
                let center = new Point(0.9 * util.rand(), 0.2, 0.9 * util.rand());
                if (center.subtract(new Point(4, 0.2, 0)).length() > 0.9) {
                    if (choose_mat < 0.6) {
                        // diffuse
                        let sphere_material = new Lambertian(Color.rand());
                        objects.push(new Sphere(center, 0.2, sphere_material));
                    } else if (choose_mat < 0.8) {
                        // metal
                        let albedo = Color.rand(0.5, 1);
                        let fuzz = util.rand(0, 0.5);
                        let sphere_material = new Metal(albedo, fuzz);
                        objects.push(new Sphere(center, 0.2, sphere_material));
                    } else {
                        // glass
                        let sphere_material = new Dielectric(1.5);
                        objects.push(new Sphere(center, 0.2, sphere_material));
                    }
                }
            }
        }

        let material1 = new Dielectric(1.5);
        objects.push(new Sphere(new Point(0, 1, 0), 1.0, material1));
        let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
        objects.push(new Sphere(new Point(-2, 1, 0), 1.0, material2));
        let material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
        objects.push(new Sphere(new Point(2, 1, 0), 1.0, material3));

        //bvh
        world.add(new BvhNode(objects));
        let imageData = renderer.render(camera, world)

        return imageData
    }
}