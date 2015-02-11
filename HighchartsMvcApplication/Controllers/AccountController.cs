using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using HighchartsMvcApplication.Models;

namespace HighchartsMvcApplication.Controllers
{

    [HandleError]
    public class AccountController : Controller
    {

        public IFormsAuthenticationService FormsService { get; set; }
        public IMembershipService MembershipService { get; set; }

        protected override void Initialize(RequestContext requestContext)
        {
            if (FormsService == null) { FormsService = new FormsAuthenticationService(); }
            if (MembershipService == null) { MembershipService = new AccountMembershipService(); }

            base.Initialize(requestContext);
        }

        // **************************************
        // URL: /Account/LogOn
        // **************************************

        public ActionResult LogOn()
        {
            return View();
        }

        [HttpPost]
        public ActionResult LogOn(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (MembershipService.ValidateUser(model.UserName, model.Password))
                {
                    FormsService.SignIn(model.UserName, model.RememberMe);
                    if (!String.IsNullOrEmpty(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "The user name or password provided is incorrect.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        // **************************************
        // URL: /Account/LogOff
        // **************************************

        public ActionResult LogOff()
        {
            FormsService.SignOut();

            return RedirectToAction("Index", "Home");
        }

        // **************************************
        // URL: /Account/Register
        // **************************************

        public ActionResult Register()
        {
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View();
        }

        [HttpPost]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                MembershipCreateStatus createStatus = MembershipService.CreateUser(model.UserName, model.Password, model.Email);

                if (createStatus == MembershipCreateStatus.Success)
                {
                    FormsService.SignIn(model.UserName, false /* createPersistentCookie */);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", AccountValidation.ErrorCodeToString(createStatus));
                }
            }

            // If we got this far, something failed, redisplay form
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View(model);
        }

        // **************************************
        // URL: /Account/ChangePassword
        // **************************************

        [Authorize]
        public ActionResult ChangePassword()
        {
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View();
        }

        [Authorize]
        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                if (MembershipService.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword))
                {
                    return RedirectToAction("ChangePasswordSuccess");
                }
                else
                {
                    ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                }
            }

            // If we got this far, something failed, redisplay form
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View(model);
        }

        // **************************************
        // URL: /Account/ChangePasswordSuccess
        // **************************************

        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Jsonp()
        {
            int[] data = new int[] { 23, 4, 34, 34, 54, 35, 34, 45, 34, 54, 35, 4, 35, 53, 35, 43 };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public class App
        {
            public int appid;
            public string name;
            public DateTime stamp;
            public int users;
        }

        [HttpGet]
        public JsonResult Stats()
        {
            //int[] data = new int[] { 23, 4, 34, 34, 54, 35, 34, 45, 34, 54, 35, 4, 35, 53, 35, 43 };
            List<App> apps = new List<App>();
            apps.Add(new App { appid = 147, name = "app", stamp = DateTime.Now.AddHours(-1), users = 543 });
            apps.Add(new App { appid = 147, name = "app", stamp = DateTime.Now.AddHours(-2), users = 876 });
            apps.Add(new App { appid = 147, name = "app", stamp = DateTime.Now.AddHours(-3), users = 463 });
            apps.Add(new App { appid = 147, name = "app", stamp = DateTime.Now.AddHours(-4), users = 56 });
            apps.Add(new App { appid = 147, name = "app", stamp = DateTime.Now.AddHours(-5), users = 107 });

            var res = new {
                stamp = (from x in apps select x.stamp),
                users = (from x in apps select x.users),
                appid = (from x in apps select x.appid),
                appname = (from x in apps select x.name)
            };

            return Json(res, JsonRequestBehavior.AllowGet);
        }

    }
}
