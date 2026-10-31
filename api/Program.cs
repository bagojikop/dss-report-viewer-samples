using Dss.Reporting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDssReporting();
var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? ["http://localhost:4200", "http://127.0.0.1:4200"];
builder.Services.AddCors(options => options.AddPolicy("sample", policy =>
    policy.WithOrigins(origins)
          .AllowAnyHeader().AllowAnyMethod()
          .WithExposedHeaders("X-Report-Warnings")));
var app = builder.Build();
app.UseCors("sample");
app.MapControllers();
app.Run();
