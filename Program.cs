using MedicalApp;
using MedicalApp.Notification;
using MedicalApp.PdfGenerator;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;
using AppContext = MedicalApp.AppContext;

var builder = WebApplication.CreateBuilder(args);

// Using QuestPdf
QuestPDF.Settings.License = LicenseType.Community;


// Si aucune URL n'est définie, définir http://localhost:5103
builder.WebHost.UseUrls("http://localhost:5103");


// Add services to the container.

// CORS pour accepter toutes les origines (utile si besoin externe)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});


// 1) Enregistrez d’abord votre DbContext (si non fait)
builder.Services.AddDbContext<AppContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2) Enregistrez le repository générique
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRendezVousRepository, RendezVousRepository>();
builder.Services.AddScoped<INotificationFactory, NotificationFactory>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// 3) Enregistrez vos services métiers
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<PraticienService>();
builder.Services.AddScoped<RendezVousService>();
builder.Services.AddScoped<DocumentMedicalService>();
builder.Services.AddScoped<OrdonnanceService>();
builder.Services.AddScoped<MedicamentService>();
builder.Services.AddScoped<PdfService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseStaticFiles();

// Utiliser CORS
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())

{
    // Affiche la page d’erreur riche avec stack trace
    app.UseDeveloperExceptionPage();

    // Optionnel : pour voir aussi les logs EF Core SQL dans la console
    // (nécessite d’avoir configuré un logger, ce que fait par défaut AddDbContext)
    app.Logger.LogInformation("Environnement Development : UseDeveloperExceptionPage activé");

    app.UseDeveloperExceptionPage();   // <— ici
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();