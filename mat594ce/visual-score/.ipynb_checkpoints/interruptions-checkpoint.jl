using Plots
default(legend = false)
x = y = range(-5, 5, length = 40)
zs = [zeros(0, 40) for _ in 1:5] # One for each peak
n = 100

# Define the x-values for the peaks (you can adjust these as per your observation)
peak_xs = [-4, -2, 0, 2, 4]

@gif for i in range(0, stop = 2π, length = n)
    # Modify the function to create 5 distinct oscillating peaks
    f(x, y) = sin(x + 10sin(i)) + cos(y) + 
              0.5*sin(x + 3y + 2sin(1.2i)) +
              0.5*cos(x - 2y + 3sin(0.8i)) + 
              0.4*sin(2x - y + 4sin(1.5i)) + 
              0.4*cos(3x + 2y + 5sin(i))

    # Create a plot with 3 subplots and a custom layout
    l = @layout [a{0.7w} b; c{0.2h}]
    p = plot(x, y, f, st = [:surface, :contourf], layout = l)

    # Induce a slight oscillating camera angle sweep, in degrees (azimuth, altitude)
    plot!(p[1], camera = (10 * (1 + cos(i)), 40))

    # Add vertical tracking lines for each peak
    for (idx, peak_x) in enumerate(peak_xs)
        z_line = [f(peak_x, yi) for yi in y]
        plot!(p[1], fill(peak_x, length(y)), y, z_line, line = (:black, 5, 1))
        global zs[idx] = vcat(zs[idx], z_line')
        plot!(p[3], zs[idx], alpha = 1, color = :blue)
    end

end fps = 2
